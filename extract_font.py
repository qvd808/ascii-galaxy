import requests
from bs4 import BeautifulSoup

# URL of the font listing
url = "https://unpkg.com/browse/figlet@1.2.3/importable-fonts/"

# Make an HTTP request to fetch the page content
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# Find all links to the JavaScript files (font names)
font_links = soup.find_all('a', href=True)

# Extract and print the font names from the links
for link in font_links:
    if link['href'].endswith('.js'):
        print(link['href'].replace('.js', ''))
