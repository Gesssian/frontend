from django.conf import settings
from django.core.management.base import BaseCommand
from minio import Minio

from .utils import *
from app.models import *


def add_users():
    User.objects.create_user("historician", "historician@gmai.com", "1234", first_name="boris", last_name="johnson")
    User.objects.create_superuser("editor", "editor@gmai.com", "1234", first_name="boris", last_name="johnson")

    for i in range(1, 10):
        User.objects.create_user(f"historician{i}", f"historician{i}@gmai.com", "1234", first_name=f"boris{i}", last_name=f"johnson{i}")
        User.objects.create_superuser(f"editor{i}", f"editor{i}@gmai.com", "1234", first_name=f"boris{i}", last_name=f"johnson{i}")


def add_climbers():
    Climber.objects.create(
        name="Эдмунд Хилари",
        description="В 11:30 утра 29 мая 1953 г. Эдмунд Хиллари из Новой Зеландии и Тенцинг Норгей, шерпа из Непала, стали первыми известными исследователями, достигшими вершины горы Эверест, которая на высоте 29 035 футов над уровнем моря является самой высокой точкой на земле. Эти двое в составе британской экспедиции совершили свой последний штурм вершины, проведя беспокойную ночь на высоте 27 900 футов. Новость об их достижении облетела весь мир 2 июня, в день коронации королевы Елизаветы II, и британцы приветствовали это как хорошее предзнаменование для будущего их страны.",
        peak="Эверест",
        image="1.png"
    )

    Climber.objects.create(
        name="Маттиас Цурбригген",
        description="В 1892 году английский барон и альпинист Мартин Конвей нанял Маттиаса для участия в своей экспедиции по Каракоруму. В рамках этой экспедиции, которая заняла 8 месяцев, они совершили первое восхождение на Пионер-Пик (6890 метров; второстепенный пик вершины Балторо-Кангри) с ледника Балторо, что являлось высочайшей покорённой вершиной в мире на тот момент.",
        peak="Аконкагуа",
        image="2.png"
    )

    Climber.objects.create(
        name="Хадсон Стак",
        description="Первое подтвержденное восхождение — американская экспедиция под командой преподобного Хадсона Стака. Самый простой и популярный маршрут на Денали — по Западному контрфорсу. Кроме технической сложности (маршрут относительно простой), при восхождении на Денали существенным фактором является погода — при ее ухудшении температура может опускаться до -40°С при штормовом ветре",
        peak="Денали",
        image="3.png"
    )

    Climber.objects.create(
        name="Ганс Мейер",
        description="Первое восхождение совершено в 1889 году немецким путешественником Гансом Мейером и австрийским альпинистом Людвигом Пуртшеллером. На вершину Ухуру ведут 6 простых маршрута — Марангу, Умбве, Шира, Немошо, Ронгаи и Машаме, не требующий альпинистской подготовки. Самый популярный, благодаря инфраструктуре — хижинам и пр. — Марангу, по нему заходит основная масса восходителей. Вершину Килиманджаро покрывает снежно-ледовая шапка, однако в последние годы она стремительно тает.",
        peak="Килиманджаро",
        image="4.png"
    )

    Climber.objects.create(
        name="Фредерик Кук",
        description="Высшая точка Северной Америка, находится на Аляске. Первое восхождение было совершено в начале прошлого века: в 1906 году Фредериком Куком, однако есть сомнения что он достиг вершины. Первое подтвержденное восхождение — американская экспедиция под командой преподобного Хадсона Стака.",
        peak="Мак-Кинли",
        image="5.png"
    )

    Climber.objects.create(
        name="Килар Хаширов",
        description="Высшая точка Кавказа и Европы в особых представлениях не нуждается. Первое восхождение на Восточную вершину Эльбруса (5621) совершил 10 июля 1829 горный проводник Килар Хаширов, участвовавший в экспедиции под руководством генерала Г.А. Эммануэля.",
        peak="Эльбрус",
        image="6.png"
    )

    client = Minio(settings.MINIO_ENDPOINT,
                   settings.MINIO_ACCESS_KEY,
                   settings.MINIO_SECRET_KEY,
                   secure=settings.MINIO_USE_HTTPS)

    for i in range(1, 7):
        client.fput_object(settings.MINIO_MEDIA_FILES_BUCKET, f'{i}.png', f"app/static/images/{i}.png")

    client.fput_object(settings.MINIO_MEDIA_FILES_BUCKET, 'default.png', "app/static/images/default.png")


def add_expeditions():
    users = User.objects.filter(is_staff=False)
    moderators = User.objects.filter(is_staff=True)
    climbers = Climber.objects.all()

    for _ in range(30):
        status = random.randint(2, 5)
        owner = random.choice(users)
        add_expedition(status, climbers, owner, moderators)

    add_expedition(1, climbers, users[0], moderators)
    add_expedition(2, climbers, users[0], moderators)
    add_expedition(3, climbers, users[0], moderators)
    add_expedition(4, climbers, users[0], moderators)
    add_expedition(5, climbers, users[0], moderators)


def add_expedition(status, climbers, owner, moderators):
    expedition = Expedition.objects.create()
    expedition.status = status

    if status in [3, 4]:
        expedition.moderator = random.choice(moderators)
        expedition.date_complete = random_date()
        expedition.date_formation = expedition.date_complete - random_timedelta()
        expedition.date_created = expedition.date_formation - random_timedelta()
    else:
        expedition.date_formation = random_date()
        expedition.date_created = expedition.date_formation - random_timedelta()

    if status == 3:
        expedition.date = random_date()

    expedition.cost = random.randint(10, 100) * 1000

    expedition.owner = owner

    for climber in random.sample(list(climbers), 3):
        item = ClimberExpedition(
            expedition=expedition,
            climber=climber,
            count=random.randint(1, 10)
        )
        item.save()

    expedition.save()


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        add_users()
        add_climbers()
        add_expeditions()
