grep -E "(\.gif|\.jpg|\.png|\.htm|youtu(\.)?be|\/r\/|imgur|\.shtml|wikipedia|video|liveleak|stream)" \
dflink.csv | ./clean.py | less -N