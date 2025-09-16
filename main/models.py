from django.db import models
from django.contrib.auth.models import User, AbstractUser
from django_ckeditor_5.fields import CKEditor5Field
from django.utils.text import slugify

class UserProfile(AbstractUser):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = CKEditor5Field('Bio')
    job = models.CharField(max_length=100, blank=True, null=True)
    resume = models.FileField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True)
    github = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    website = models.URLField(blank=True)

    def __str__(self):
        return self.username

class Skill(models.Model):
    name = models.CharField(max_length=100)
    icon = models.ImageField(upload_to='icons/', blank=True, null=True)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='skills')


    def __str__(self):
        return f"{self.name})"

class SoftSkill(models.Model):
    name = models.CharField(max_length=100)
    icon = models.ImageField(upload_to='icons/', blank=True, null=True)
    is_active = models.BooleanField(default=False)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='softskills')

    def __str__(self):
        return self.name

class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)
    def __str__(self):
        return self.name

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = CKEditor5Field('Description')
    image = models.ImageField(upload_to='projects/')
    tag = models.ManyToManyField(Tag)
    project_url = models.URLField(blank=True, null=True)
    git_hub = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class ProjectCoverImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='cover_images')
    image = models.ImageField(upload_to='projects/covers/', blank=True, null=True)

    def __str__(self):
        return str(self.image)

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = CKEditor5Field('Content')
    description = models.CharField(default="Hech qanday malumot mavjud emas.")
    image = models.ImageField(upload_to='blog/' ,blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tag = models.ManyToManyField(Tag)
    is_published = models.BooleanField(default=True)
    read_time = models.PositiveIntegerField(default=0)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            num = 1
            while BlogPost.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{num}"
                num += 1
            self.slug = slug
        super().save(*args, **kwargs)

    @property
    def views_count(self):
        return self.views.count()

    def __str__(self):
        return self.title

class BlogCoverImage(models.Model):
    image = models.ImageField(upload_to='blog/' ,blank=True, null=True)
    blogpost = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='cover_images')

    def __str__(self):
        return str(self.image)

class Experience(models.Model):
    job_title = models.CharField(max_length=150)
    company = models.CharField(max_length=150)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    description = CKEditor5Field('description')

    def __str__(self):
        return f"{self.job_title} at {self.company}"

class Education(models.Model):
    school = models.CharField(max_length=200)
    degree = models.CharField(max_length=150)
    teacher = models.CharField(max_length=150)
    start_year = models.PositiveIntegerField()
    end_year = models.PositiveIntegerField(blank=True, null=True)
    description = CKEditor5Field('description')

    def __str__(self):
        return f"{self.degree} - {self.school}"

class Message(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.PositiveIntegerField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.subject} from {self.name}"


class PageViewLog(models.Model):
    project = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='views')
    ip_address = models.GenericIPAddressField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('project', 'ip_address')

    def __str__(self):
        return f"View from {self.ip_address} on {self.project.title}"
