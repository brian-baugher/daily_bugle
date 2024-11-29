from datetime import datetime, timedelta
import random
import json

# Helper function to generate random dates in UTC
def random_date_within_days(days_range=7):
    return datetime.utcnow() - timedelta(days=random.randint(0, days_range))

# Helper function to generate random comment
def generate_comment():
    comments = [
        "Great article! Very informative.",
        "I disagree with some of the points made.",
        "Could you elaborate on this topic further?",
        "Interesting perspective, I hadn't thought about it that way.",
        "This article was a bit confusing in some parts."
    ]
    return random.choice(comments)

# Helper function to generate random article categories
def generate_categories():
    categories = ["Technology", "Health", "Sports", "Business", "Science", "Entertainment", "Politics"]
    return random.sample(categories, random.randint(1, 4))

# Helper function to generate random article titles and bodies
def generate_article_content():
    titles = [
        "The Future of Artificial Intelligence",
        "Global Warming and its Impact",
        "The Rise of Electric Vehicles",
        "How to Stay Healthy in the Modern World",
        "Exploring the Universe: Space Travel Advances",
        "The Stock Market: A Beginner's Guide",
        "The Evolution of Social Media",
        "Mental Health Awareness in 2024",
        "Breaking Down the Latest Economic Trends",
        "The History and Future of Renewable Energy",
        "Exploring Digital Privacy in the Modern Age",
        "How Cryptocurrency is Shaping the Future of Finance",
        "Trends in Remote Work: What the Future Holds",
        "The Impact of Climate Change on Global Agriculture",
        "The Importance of Cybersecurity in Today's World"
    ]
    
    bodies = [
        "This article explores the latest advancements in artificial intelligence and how it is shaping various industries. From healthcare to finance, AI is transforming the way we live and work. We dive deep into its potential and the ethical considerations surrounding it.",
        "Global warming has become one of the most pressing issues of our time. In this article, we examine the effects of rising global temperatures on the planet, including extreme weather patterns, rising sea levels, and the impact on ecosystems.",
        "Electric vehicles are gaining popularity due to environmental concerns and advancements in technology. This article looks at the rise of electric vehicles, their benefits, challenges, and what the future holds for the automotive industry.",
        "Maintaining a healthy lifestyle is essential in today's fast-paced world. We provide practical tips for staying healthy, including nutrition advice, exercise routines, and mental health practices.",
        "The exploration of space has reached new heights with advanced technologies. This article delves into recent space travel advancements, from Mars exploration to private companies entering the space race.",
        "Investing in the stock market can seem overwhelming for beginners. In this guide, we break down the basics of stock market investing, including how to start, common mistakes to avoid, and tips for building a portfolio.",
        "Social media has revolutionized communication, but it has also raised concerns about privacy and mental health. We analyze the evolution of social media platforms and their role in modern society.",
        "Mental health is becoming an increasingly important topic as awareness grows. This article discusses mental health issues in 2024, the stigma surrounding them, and the importance of seeking help.",
        "The global economy is constantly changing. In this article, we take a closer look at the latest economic trends, from inflation to unemployment rates, and what they mean for the average person.",
        "Renewable energy is key to combating climate change. This article explores the history of renewable energy, the current state of solar, wind, and hydropower, and the future of sustainable energy sources.",
        "With the increasing threats to digital privacy, individuals and companies alike are looking for ways to protect their personal information. This article explores the importance of digital privacy and how to safeguard your data online.",
        "Cryptocurrency is disrupting the traditional financial system. We explore the basics of cryptocurrency, its rise in popularity, the technology behind it, and how it is changing the landscape of finance.",
        "Remote work has become more common in recent years, and the trend is likely to continue. This article explores the pros and cons of remote work, how companies are adapting, and what it means for employees.",
        "Climate change is affecting agriculture in many regions of the world. This article examines how rising temperatures and shifting weather patterns are impacting crop production, food security, and farming communities.",
        "Cybersecurity is a growing concern as more of our personal and professional lives move online. In this article, we discuss the importance of cybersecurity, current threats, and how individuals and companies can protect themselves."
    ]
    
    title = random.choice(titles)
    body = random.choice(bodies)
    
    return title, body

def get_contributor():
    people = [
            "6748d694d822597b5ba13392",
            "6748d6ffd822597b5ba13393",
            "6748d71bd822597b5ba13394",
            "6748d727d822597b5ba13395",
            "6748d72fd822597b5ba13396"
            ]
    return random.choice(people)

# Generate 15 articles with 1-5 comments and 1-4 categories
articles = []
for _ in range(15):
    title, body = generate_article_content()
    article = {
        "title": title,
        "teaser": body[:150] + "...",  # Teaser is first 150 characters of the body
        "body": body,
        "dateCreated": {"$date": random_date_within_days(30).isoformat()},
        "dateLastEdited": {"$date": random_date_within_days(30).isoformat()},
        "categories": generate_categories(),
        "comments": [
            {"comment": generate_comment(), "dateCreated": {"$date": random_date_within_days(7).isoformat()}, "contributor": {"$oid": get_contributor()}} 
            for _ in range(random.randint(1, 5))
        ]
    }
    articles.append(article)

# Convert the list of articles to JSON format
articles_json = json.dumps(articles, indent=4)

# Output the result
print(articles_json)


