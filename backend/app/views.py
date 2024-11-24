from datetime import datetime

from django.contrib.auth import authenticate
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import *


def get_draft_expedition():
    return Expedition.objects.filter(status=1).first()


def get_user():
    return User.objects.filter(is_superuser=False).first()


def get_moderator():
    return User.objects.filter(is_superuser=True).first()


@api_view(["GET"])
def search_climbers(request):
    climber_name = request.GET.get("climber_name", "")

    climbers = Climber.objects.filter(status=1)

    if climber_name:
        climbers = climbers.filter(name__icontains=climber_name)

    serializer = ClimbersSerializer(climbers, many=True)
    
    draft_expedition = get_draft_expedition()

    resp = {
        "climbers": serializer.data,
        "climbers_count": ClimberExpedition.objects.filter(expedition=draft_expedition).count() if draft_expedition else None,
        "draft_expedition": draft_expedition.pk if draft_expedition else None
    }

    return Response(resp)


@api_view(["GET"])
def get_climber_by_id(request, climber_id):
    if not Climber.objects.filter(pk=climber_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    climber = Climber.objects.get(pk=climber_id)
    serializer = ClimberSerializer(climber)

    return Response(serializer.data)


@api_view(["PUT"])
def update_climber(request, climber_id):
    if not Climber.objects.filter(pk=climber_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    climber = Climber.objects.get(pk=climber_id)

    serializer = ClimberSerializer(climber, data=request.data, partial=True)

    if serializer.is_valid(raise_exception=True):
        serializer.save()

    return Response(serializer.data)


@api_view(["POST"])
def create_climber(request):
    serializer = ClimberSerializer(data=request.data, partial=False)

    serializer.is_valid(raise_exception=True)

    Climber.objects.create(**serializer.validated_data)

    climbers = Climber.objects.filter(status=1)
    serializer = ClimberSerializer(climbers, many=True)

    return Response(serializer.data)


@api_view(["DELETE"])
def delete_climber(request, climber_id):
    if not Climber.objects.filter(pk=climber_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    climber = Climber.objects.get(pk=climber_id)
    climber.status = 2
    climber.save()

    climbers = Climber.objects.filter(status=1)
    serializer = ClimberSerializer(climbers, many=True)

    return Response(serializer.data)


@api_view(["POST"])
def add_climber_to_expedition(request, climber_id):
    if not Climber.objects.filter(pk=climber_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    climber = Climber.objects.get(pk=climber_id)

    draft_expedition = get_draft_expedition()

    if draft_expedition is None:
        draft_expedition = Expedition.objects.create()
        draft_expedition.owner = get_user()
        draft_expedition.date_created = timezone.now()
        draft_expedition.save()

    if ClimberExpedition.objects.filter(expedition=draft_expedition, climber=climber).exists():
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        
    item = ClimberExpedition.objects.create()
    item.expedition = draft_expedition
    item.climber = climber
    item.save()

    serializer = ExpeditionSerializer(draft_expedition)
    return Response(serializer.data["climbers"])


@api_view(["POST"])
def update_climber_image(request, climber_id):
    if not Climber.objects.filter(pk=climber_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    climber = Climber.objects.get(pk=climber_id)

    image = request.data.get("image")
    if image is not None:
        climber.image = image
        climber.save()

    serializer = ClimberSerializer(climber)

    return Response(serializer.data)


@api_view(["GET"])
def search_expeditions(request):
    status = int(request.GET.get("status", 0))
    date_formation_start = request.GET.get("date_formation_start")
    date_formation_end = request.GET.get("date_formation_end")

    expeditions = Expedition.objects.exclude(status__in=[1, 5])

    if status > 0:
        expeditions = expeditions.filter(status=status)

    if date_formation_start and parse_datetime(date_formation_start):
        expeditions = expeditions.filter(date_formation__gte=parse_datetime(date_formation_start))

    if date_formation_end and parse_datetime(date_formation_end):
        expeditions = expeditions.filter(date_formation__lt=parse_datetime(date_formation_end))

    serializer = ExpeditionsSerializer(expeditions, many=True)

    return Response(serializer.data)


@api_view(["GET"])
def get_expedition_by_id(request, expedition_id):
    if not Expedition.objects.filter(pk=expedition_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    expedition = Expedition.objects.get(pk=expedition_id)
    serializer = ExpeditionSerializer(expedition, many=False)

    return Response(serializer.data)


@api_view(["PUT"])
def update_expedition(request, expedition_id):
    if not Expedition.objects.filter(pk=expedition_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    expedition = Expedition.objects.get(pk=expedition_id)
    serializer = ExpeditionSerializer(expedition, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(["PUT"])
def update_status_user(request, expedition_id):
    if not Expedition.objects.filter(pk=expedition_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    expedition = Expedition.objects.get(pk=expedition_id)

    if expedition.status != 1:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    expedition.status = 2
    expedition.date_formation = timezone.now()
    expedition.save()

    serializer = ExpeditionSerializer(expedition, many=False)

    return Response(serializer.data)


@api_view(["PUT"])
def update_status_admin(request, expedition_id):
    if not Expedition.objects.filter(pk=expedition_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    request_status = int(request.data["status"])

    if request_status not in [3, 4]:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    expedition = Expedition.objects.get(pk=expedition_id)

    if expedition.status != 2:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    if request_status == 3:
        expedition.date = timezone.now()

    expedition.date_complete = timezone.now()
    expedition.status = request_status
    expedition.moderator = get_moderator()
    expedition.save()

    return Response(status=status.HTTP_200_OK)


@api_view(["DELETE"])
def delete_expedition(request, expedition_id):
    if not Expedition.objects.filter(pk=expedition_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    expedition = Expedition.objects.get(pk=expedition_id)

    if expedition.status != 1:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    expedition.status = 5
    expedition.save()

    serializer = ExpeditionSerializer(expedition, many=False)

    return Response(serializer.data)


@api_view(["DELETE"])
def delete_climber_from_expedition(request, expedition_id, climber_id):
    if not ClimberExpedition.objects.filter(expedition_id=expedition_id, climber_id=climber_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    item = ClimberExpedition.objects.get(expedition_id=expedition_id, climber_id=climber_id)
    item.delete()

    items = ClimberExpedition.objects.filter(expedition_id=expedition_id)
    data = [ClimberItemSerializer(item.climber, context={"count": item.count}).data for item in items]

    return Response(data, status=status.HTTP_200_OK)


@api_view(["PUT"])
def update_climber_in_expedition(request, expedition_id, climber_id):
    if not ClimberExpedition.objects.filter(climber_id=climber_id, expedition_id=expedition_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    item = ClimberExpedition.objects.get(climber_id=climber_id, expedition_id=expedition_id)

    serializer = ClimberExpeditionSerializer(item, data=request.data,  partial=True)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(["POST"])
def register(request):
    serializer = UserRegisterSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(status=status.HTTP_409_CONFLICT)

    user = serializer.save()

    serializer = UserSerializer(user)

    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
def login(request):
    serializer = UserLoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

    user = authenticate(**serializer.data)
    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    serializer = UserSerializer(user)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
def logout(request):
    return Response(status=status.HTTP_200_OK)


@api_view(["PUT"])
def update_user(request, user_id):
    if not User.objects.filter(pk=user_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    user = User.objects.get(pk=user_id)
    serializer = UserSerializer(user, data=request.data, partial=True)

    if not serializer.is_valid():
        return Response(status=status.HTTP_409_CONFLICT)

    serializer.save()

    return Response(serializer.data)