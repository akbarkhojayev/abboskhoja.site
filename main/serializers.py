from rest_framework import serializers
from .models import *
from rest_framework.fields import SerializerMethodField

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'


class SkillSerializer1(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['name', 'icon']


class SoftSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoftSkill
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    skills = SkillSerializer1(many=True, read_only=True)
    softskills = SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            'first_name', 'last_name', 'avatar', 'bio', 'job', 'resume',
            'location', 'github', 'linkedin', 'website', 'skills', 'softskills'
        ]

    def get_softskills(self, obj):
        active_softskills = obj.softskills.filter(is_active=True)
        return SoftSkillSerializer(active_softskills, many=True).data

class ProjectSerializer(serializers.ModelSerializer):
    tag = serializers.SlugRelatedField(
        many=True,
        queryset=Tag.objects.all(),
        slug_field='name'
    )
    image = serializers.ImageField(required=False)

    class Meta:
        model = Project
        fields = '__all__'

class ProjectSerializerCreate(serializers.ModelSerializer):
    tag = serializers.ListField(child=serializers.CharField(), write_only=True)

    class Meta:
        model = Project
        fields = '__all__'

    def create(self, validated_data):
        tag_names = validated_data.pop('tag', [])
        project = Project.objects.create(**validated_data)

        tags = []
        for name in tag_names:
            tag_obj, _ = Tag.objects.get_or_create(name=name)
            tags.append(tag_obj)

        project.tag.set(tags)
        return project

class BlogPostSerializer(serializers.ModelSerializer):

    tag = serializers.SlugRelatedField(
        many=True,
        queryset=Tag.objects.all(),
        slug_field='name'
    )
    image = serializers.ImageField(required=False)
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'content', 'image', 'tag',
            'created_at', 'updated_at',
             'description', 'is_published', 'read_time'
        ]
        read_only_fields = ['slug']




class BlogPostSerializerCreate(serializers.ModelSerializer):
    tag = serializers.ListField(child=serializers.CharField(), write_only=True)

    class Meta:
        model = BlogPost
        fields = '__all__'
        read_only_fields = ['slug']

    def create(self, validated_data):
        tag_names = validated_data.pop('tag', [])
        blog = BlogPost.objects.create(**validated_data)

        tags = []
        for name in tag_names:
            tag_obj, _ = Tag.objects.get_or_create(name=name)
            tags.append(tag_obj)

        blog.tag.set(tags)
        return blog

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'

class EducationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

class PageViewLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageViewLog
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['name']

class LeetCodeSolutionListSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = LeetCodeSolution
        fields = [
            'id',
            'problem_number',
            'title',
            'difficulty',
            'language',
            'time_complexity',
            'space_complexity',
            'slug',
            'created_at',
            'tags',
        ]

class LeetCodeSolutionDetailSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = LeetCodeSolution
        fields = [
            'id',
            'problem_number',
            'title',
            'difficulty',
            'language',
            'problem_statement',
            'approach',
            'solution_code',
            'explanation',
            'time_complexity',
            'space_complexity',
            'leetcode_url',
            'tags',
            'slug',
            'created_at',
            'updated_at',
        ]

