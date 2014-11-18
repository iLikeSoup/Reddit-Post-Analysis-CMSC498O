#!/bin/bash
cd pulls
sed -i 's/ comments,/,/' *.csv
sed -i 's/\/r\///' *.csv