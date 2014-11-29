sed --regexp-extended -i 's/, /,/g' *.csv
sed --regexp-extended -i 's/ comment(s?)//g' *.csv
sed -i "/,comment,/d" *.csv