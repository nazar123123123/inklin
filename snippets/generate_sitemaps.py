# -*- coding: utf-8 -*


counter = 1
filename = 1
line = ""

for x in range(6294717, 1, -1):
    line = line + "<url>\n"
    line = line + "<loc>http://inkl.in/"+str(x)+ "</loc>\n" 
    # line = line = "<changefreq>never</changefreq>"
    line = line + "</url>\n"

    counter=counter+1
    if counter == 45000:
        counter = 1

        file = open(str(filename) + ".xml", "w") 
        file.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        file.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        file.write(line)
        file.write("</urlset>")
        file.close()
        filename = filename + 1
        line = ""
    
