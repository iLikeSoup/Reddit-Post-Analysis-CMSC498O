#!/usr/bin/env python

import sys

def purge(line):
	for i in xrange(len(text)):
		if line == text[i]:
			return i
	return -1

with open('dflink.csv') as f:
	text = f.read().strip().split('\n')

for line in sys.stdin:
	ind = purge(line.strip())
	#assert(ind != -1)
	if ind != -1:
		del text[ind]

for i in text:
	print i