# Quick Script to Add Required IDs to Templates 04-09
# This documents the exact changes needed for each template

import os

TEMPLATES_TO_FIX = {
    "template04": {
        "name_line": 83-84,  # h1 with "I'm Your Name"
        "title_line": 87-88,  # p with tagline
        "main_image_line": 108,  # img src in hero
        "bio_line": 138-143,  # First p tag in about section
        "education_header_line": 150,
        "education_container_line": 151,
        "projects_header_line": 173,
        "projects_container_line": 177,
        "skills_header_line": 217,
        "skills_container_line": 218,
        "certifications_header_line": 257,
        "certifications_container_line": 258,
        "social_email_line": 291,
        "social_linkedin_line": 297,
        "social_github_line": 303,
        # Need to add social-website and social-twitter
    },
    "template05-09": "Similar pattern - add IDs to h1, p, img, containers"
}

# Required IDs checklist for ALL templates:
REQUIRED_IDS = [
    "portfolio-name",  # h1 or main name heading
    "portfolio-title",  # p or subtitle
    "portfolio-bio",  # p in about section
    "portfolio-hero-image",  # small header image
    "portfolio-main-image",  # large hero image
    "portfolio-education-header",
    "portfolio-education",
    "portfolio-projects-header",
    "portfolio-projects",
    "portfolio-skills-header",
    "portfolio-skills",
    "portfolio-certifications-header",  
    "portfolio-certifications",
    "portfolio-location",  # if present
    "social-email",
    "social-github",
    "social-linkedin",
    "social-twitter",
    "social-website"
]

print("✅ Templates 01, 02, 03 are COMPLETE")
print("⏳ Templates 04-09 need IDs added manually")
print(f"\n📋 Each template needs {len(REQUIRED_IDS)} IDs added")
print("\nIMPORTANT: Also add ZestFolio CTA section before </body>")
