all:
	echo "Try cd js/forum; gulp watch"


upload:
	rsync \
		-rv \
		--exclude=.git \
		./ \
		dreamhost:artificialworlds.net/rabbit-escape/levels/workbench/flarum-ext-rabbitescape-leveleditor/
