#!/usr/bin/env python

import re
import sys

with open('dflink.csv', 'r') as f:
	text = f.read().strip().split('\n')

img_patt = re.compile(r'(?P<image>\.png|\.jpg|imgur)')
vid_patt = re.compile(r'(?P<video>\.gif(?:v)?|youtu(?:\.)?be|video|liveleak|stream)')
webpg_patt = re.compile(r'(?P<webpage>\.(?:s)?htm(?:l)?|wikipedia)')
reddit_patt = re.compile(r'(?P<reddit>\/r\/)')
patt = [webpg_patt, reddit_patt, img_patt, vid_patt]
patt_dict = {0:'webpage', 1:'reddit post', 2:'image', 3:'video'}
count_dict = {'webpage':0, 'reddit post':0, 'image':0, 'video':0}

for i in text:
	for j in xrange(len(patt)):
		if patt[j].search(i) != None:
			count_dict[patt_dict[j]] += 1
			break
	else:
		count_dict['webpage'] += 1

for k,v in count_dict.items():
	print(k,v)