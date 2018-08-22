# -*- coding: utf-8 -*


counter = 1
filename = 1
line = ""

for x in range(6191961, 1, -1):
    line = line + "<url>\n"
    line = line + "<loc>http://inkl.in/"+str(x)+ "</loc>\n" 
    line = line + "<image:image>\n"
    line = line + "   <image:loc>http://img.inkl.in/api/shotter?block="+str(x)+"</image:loc>\n"
    line = line + "   <image:caption>Visualisation of the Ethereum Block "+str(x)+"</image:caption>\n"
    line = line + "</image:image>\n"
    line = line + "</url>\n"

    print(counter)
    counter=counter+1
    if counter == 1000:
        counter = 1

        file = open(str(filename) + ".xml", "w") 
        file.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        file.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"') 
        file.write('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"')
        file.write('xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n')
        file.write(line)
        file.write("</urlset>")
        file.close()
        filename = filename + 1
    