all:
	echo "Try cd js/forum; gulp watch"


upload:
	rsync \
		-r \
		--exclude=.git \
		./ \
		dreamhost:artificialworlds.net/rabbit-escape/levels/workbench/flarum-ext-rabbitescape-leveleditor/
	ssh dreamhost "cd artificialworlds.net/rabbit-escape/levels; php flarum cache:clear"
	@echo "If it doesn't work, unload and reload the Rabbit Escape extension."
