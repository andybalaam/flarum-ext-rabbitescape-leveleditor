all:
	@echo "Try make upload"


upload:
	#scp flarum/extend.php rabbitescape.artificialworlds.net:flarum/
	#ssh rabbitescape.artificialworlds.net 'mkdir -p rabbitescape.artificialworlds.net/customjs'
	scp rabbitescape.artificialworlds.net/customjs/flarum-rabbitescape.js rabbitescape.artificialworlds.net:rabbitescape.artificialworlds.net/customjs/
