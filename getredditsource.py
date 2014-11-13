#!/usr/bin/python
from lxml import html
import urllib2
import sys

# Pull Reddit "front-page" source code
page = urllib2.urlopen("http://www.reddit.com?limit={}".format(sys.argv[1])).read()

print page
