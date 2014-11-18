#!/bin/bash
cd pulls
sed -i 's/, \([0-9]+\) comments,/\1,/' *.csv
sed -i 's/, \/r\///' *.csv