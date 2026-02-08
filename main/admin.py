from django.contrib import admin
from django_ckeditor_5.widgets import CKEditor5Widget
from django import forms
from .models import UserProfile, Skill, Project, BlogPost, Experience, Education,SoftSkill , Message, PageViewLog, Tag
from django.utils.html import format_html

class UserProfileAdminForm(forms.ModelForm):
    bio = forms.CharField(widget=CKEditor5Widget())

    class Meta:
        model = UserProfile
        fields = '__all__'

class ProjectAdminForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditor5Widget())

    class Meta:
        model = Project
        fields = '__all__'

class BlogPostAdminForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditor5Widget())

    class Meta:
        model = BlogPost
        fields = '__all__'

class ExperienceAdminForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditor5Widget())

    class Meta:
        model = Experience
        fields = '__all__'


class EducationAdminForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditor5Widget())

    class Meta:
        model = Education
        fields = '__all__'

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    form = UserProfileAdminForm
    list_display = ('username', 'first_name', 'last_name', 'email')
    search_fields = ('username', 'first_name', 'last_name', 'email')

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(SoftSkill)
class SoftSkillAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    form = ProjectAdminForm
    list_display = ('title', 'project_url', 'created_at')
    search_fields = ('title',)

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    form = BlogPostAdminForm
    list_display = ('title', 'is_published', 'created_at', 'updated_at', 'read_time')
    list_filter = ('is_published', 'created_at')
    search_fields = ('title', 'content', 'tag')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    form = ExperienceAdminForm
    list_display = ('job_title', 'company', 'start_date', 'end_date')
    search_fields = ('job_title', 'company')

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    form = EducationAdminForm
    list_display = ('degree', 'school', 'teacher', 'start_year', 'end_year')
    search_fields = ('degree', 'school', 'teacher')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('subject', 'name', 'email', 'created_at', 'is_read')
    list_filter = ('is_read', 'created_at')
    search_fields = ('subject', 'name', 'email')

@admin.register(PageViewLog)
class PageViewLogAdmin(admin.ModelAdmin):
    list_display = ('project', 'ip_address', 'timestamp')
    list_filter = ('timestamp',)
    search_fields = ('ip_address', 'project__title')

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

from django.contrib import admin
from .models import LeetCodeSolution

@admin.register(LeetCodeSolution)
class LeetCodeSolutionAdmin(admin.ModelAdmin):
    list_display = ('problem_number', 'title', 'difficulty', 'language', 'created_at')
    list_filter = ('difficulty', 'language', 'created_at')
    search_fields = ('title', 'problem_number')
    prepopulated_fields = {"slug": ("title",)}
