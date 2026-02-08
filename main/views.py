from rest_framework import generics
from rest_framework.generics import get_object_or_404
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from main.serializers import *
from .pagenations import CustomPageNumberPagination

class UserProfileView(generics.ListAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [AllowAny]


class SkillListView(generics.ListAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [AllowAny]

class ProjectListView(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    pagination_class = CustomPageNumberPagination
    permission_classes = [AllowAny]

class ProjectRetrieveDeleteUpdateView(generics.RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.request.method in ['DELETE']:
            return [IsAuthenticated()]
        return [AllowAny()]


class BlogPostListView(generics.ListAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    pagination_class = CustomPageNumberPagination
    permission_classes = [AllowAny]
    lookup_field = 'slug'

class BlogPostRetrieveDestroyView(generics.RetrieveAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        ip = self.get_client_ip(request)

        PageViewLog.objects.get_or_create(
            project=instance,
            ip_address=ip,
        )

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    lookup_field = 'slug'


class BlogPostDetailView(generics.RetrieveAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    lookup_field = 'slug'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        ip = self.get_client_ip(request)

        PageViewLog.objects.get_or_create(
            project=instance,
            ip_address=ip,
        )

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class ExperienceListView(generics.ListAPIView):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [AllowAny]

class ExperienceRetrieveDeleteUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated()]
        return [AllowAny()]

class EducationListView(generics.ListAPIView):
    queryset = Education.objects.all()
    serializer_class = EducationsSerializer
    permission_classes = [AllowAny]

class EducationRetrieveDeleteUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Education.objects.all()
    serializer_class = EducationsSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated()]
        return [AllowAny()]

class MessageListView(generics.ListAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]

class MessageCreateView(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]

class MessageRetrieveDeleteUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated()]
        return [AllowAny()]

class PageViewLogListView(generics.ListAPIView):
    queryset = PageViewLog.objects.all()
    serializer_class = PageViewLogSerializer
    permission_classes = [IsAuthenticated]


class TagListView(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    def get_permissions(self):
        if self.request.method in ['POST']:
            return [IsAuthenticated()]
        return [AllowAny()]

class SoftSkillListAPIView(generics.ListCreateAPIView):
    serializer_class = SoftSkillSerializer

    def get_queryset(self):
        return SoftSkill.objects.filter(is_active=True)

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

class SoftSkillRetrieveDeleteUpdateView(generics.RetrieveUpdateAPIView):
    queryset = SoftSkill.objects.all()
    serializer_class = SkillSerializer
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated()]
        return [AllowAny()]


from rest_framework.generics import ListAPIView
from .models import LeetCodeSolution
from .serializers import LeetCodeSolutionListSerializer


class LeetCodeSolutionListAPIView(ListAPIView):
    serializer_class = LeetCodeSolutionListSerializer

    def get_queryset(self):
        return LeetCodeSolution.objects.filter(
            is_published=True
        ).prefetch_related('tags').order_by('-created_at')

from rest_framework.generics import RetrieveAPIView
from .models import LeetCodeSolution
from .serializers import LeetCodeSolutionDetailSerializer


class LeetCodeSolutionDetailAPIView(RetrieveAPIView):
    queryset = LeetCodeSolution.objects.filter(is_published=True)
    serializer_class = LeetCodeSolutionDetailSerializer
    lookup_field = 'slug'
