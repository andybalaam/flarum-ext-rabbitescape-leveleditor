all:
	echo "Try cd js/forum; gulp watch"


upload:
	rsync \
		-r \
		--exclude=.git \
		./ \
		dreamhost:artificialworlds.net/rabbit-escape/levels/workbench/flarum-ext-rabbitescape-leveleditor/
	@echo "Now clear cache and/or unload and reload the Rabbit Escape extension."
