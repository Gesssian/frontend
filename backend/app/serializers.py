from rest_framework import serializers

from .models import *


class ClimbersSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    def get_image(self, climber):
        if climber.image:
            return climber.image.url.replace("minio", "localhost", 1)

        return "http://localhost:9000/images/default.png"

    class Meta:
        model = Climber
        fields = ("id", "name", "status", "peak", "image")


class ClimberSerializer(ClimbersSerializer):
    class Meta(ClimbersSerializer.Meta):
        model = Climber
        fields = "__all__"


class ExpeditionsSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)
    moderator = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Expedition
        fields = "__all__"


class ExpeditionSerializer(ExpeditionsSerializer):
    climbers = serializers.SerializerMethodField()

    def get_climbers(self, expedition):
        items = ClimberExpedition.objects.filter(expedition=expedition)
        return [ClimberItemSerializer(item.climber, context={"count": item.count}).data for item in items]


class ClimberItemSerializer(ClimberSerializer):
    count = serializers.SerializerMethodField()

    def get_count(self, _):
        return self.context.get("count")

    class Meta:
        model = Climber
        fields = ("id", "name", "peak", "image", "count")


class ClimberExpeditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClimberExpedition
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username')


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'username')
        write_only_fields = ('password',)
        read_only_fields = ('id',)

    def create(self, validated_data):
        user = User.objects.create(
            email=validated_data['email'],
            username=validated_data['username']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    password = serializers.CharField(required=False)


class UserProfileSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    email = serializers.CharField(required=False)
    password = serializers.CharField(required=False)
