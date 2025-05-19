all:
	@echo "Try make upload"


upload:
	lftp sftp://artific:@www644.your-server.de -e "cd public_html/rabbitescape.artificialworlds.net; put rabbitescape.artificialworlds.net/extend.php; exit"
	lftp sftp://artific:@www644.your-server.de -e "mirror -R rabbitescape.artificialworlds.net/public/customjs/ public_html/rabbitescape.artificialworlds.net/public/customjs/; exit"
	#scp flarum/extend.php rabbitescape.artificialworlds.net:flarum/
	#ssh rabbitescape.artificialworlds.net 'mkdir -p rabbitescape.artificialworlds.net/customjs'
	#scp rabbitescape.artificialworlds.net/customjs/flarum-rabbitescape.js rabbitescape.artificialworlds.net:rabbitescape.artificialworlds.net/customjs/
