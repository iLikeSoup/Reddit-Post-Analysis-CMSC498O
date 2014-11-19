#!/bin/bash
cd pulls/
sed --regexp-extended -i 's/, ([0-9]+) comments,/, \1,/' *.csv
sed --regexp-extended -i 's/, \/r\/([a-zA-Z]+),/, \1,/' *.csv