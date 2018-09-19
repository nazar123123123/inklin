import urllib, json
import glob
import os


# Set the latest Block form the API

url = "http://api.inkl.in/api/inklin/live/0"
response = urllib.urlopen(url)
data = json.loads(response.read())
print "Starting from " + str(data["block_number"])


counter = 1
filename = 1
line = ""

for x in range(int(data["block_number"]), 1, -1):
    line = line + "<url>\n"
    line = line + "<loc>http://inkl.in/"+str(x)+ "</loc>\n" 
    line = line + "<changefreq>never</changefreq>"
    line = line + "</url>\n"

    counter=counter+1
    if counter == 50000:
        counter = 1
        print("Writing " + str(filename))
        file = open("/mnt/sitemaps/" + str(filename) + ".xml", "w") 
        file.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        file.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        file.write(line)
        file.write("</urlset>")
        file.close()
        filename = filename + 1
        line = ""
    
sitemapindex = '<?xml version="1.0" encoding="UTF-8"?>\n'
sitemapindex = sitemapindex + '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

os.remove("/mnt/sitemaps/map.xml")

for file in glob.glob('*.xml'):
    sitemapindex = sitemapindex + '<sitemap>\n'
    sitemapindex = sitemapindex + '  <loc>http://inkl.in/sitemaps/' + file + '</loc>\n'
    sitemapindex = sitemapindex + '</sitemap>\n'

sitemapindex = sitemapindex + '</sitemapindex>'

sitemap = open("/mnt/sitemaps/map.xml", "w") 
sitemap.write(sitemapindex)
sitemap.close()

print(sitemapindex)