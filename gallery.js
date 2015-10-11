SirTrevor.Blocks.Gallery = SirTrevor.Blocks.Image.extend({

	title: function() {return "Gallery"},
	type: "Gallery",
	icon_name: 'image',


	loadData: function(data){
		console.log(data);
		var block = this;
		data.items.forEach(function(item){
			$output = block.renderImageBlock(item);
			block.$editor.append($output);
		});

		this.$inputs.show();
	},

	change_caption: function(event) {
		var editor = event.data.editor;
		var result = {items:[]};

		var images = editor.$('.gallery-block');
		for (i=0; i<images.length; i++) {
			var file = {
				'url': editor.$(images[i]).find('img').attr('src'),
				'caption': editor.$(images[i]).find('input').val()
			};
			result.items.push(file)
		}

		editor.setData(result);
	},

	delete_image: function (event) {
		var editor = event.data.editor;
		if (confirm("Are you sure you want to remove the picture?")) {
			editor.$(this).parent().remove();
			editor.change_caption(event)
		}


	},

	renderImageBlock: function(image){
		$output = $('<div>', {class:'gallery-block'});

		var delete_link = $('<a>', {href: '#', 'data-icon': "bin"});
		delete_link.click({editor:this}, this.delete_image);

		$output.append(delete_link);

		$output.append($('<img>', { src: image.url}));
		var image_caption = $('<input>', {
			type: 'text',
			class: 'st-input-string js-caption-input',
			name: 'caption',
			placeholder: 'Image caption',
			value: image.caption
		});
		image_caption.change({editor:this}, this.change_caption);
		$output.append(image_caption);

		return $output;
	},


	onBlockRender: function(){
		this.$inputs.before($('<div>', {style:'clear:both'}));

		this.$inputs.find('button').bind('click', function(ev){ ev.preventDefault(); });
		this.$inputs.find('input').on('change', _.bind(function(ev){
			this.onDrop(ev.currentTarget);
		}, this));

		this.$inputs.append($('<input>', {type: 'text', class: 'st-input-string js-caption-input', name: 'caption', placeholder: 'Описание картинки', style: 'width: 100%; margin-top:10px; text-align: center;', value: ''}));
	},

	onUploadSuccess : function(data) {
		var caption = $('.st-block__inputs [name=caption]').val() || '';
		var old_data = this.getData();
		var items = old_data.items || [];
		data.file.caption = caption;
		items.push(data.file);

		old_data.items = items;
		this.$editor.append(this.renderImageBlock(data.file));

		this.setData(old_data);
		this.ready();
	},

	onUploadError : function(jqXHR, status, errorThrown){
		this.addMessage('Upload Error');
		this.ready();
	},

	onDrop: function(transferData){
		var file = transferData.files[0],
			urlAPI = (typeof URL !== "undefined") ? URL : (typeof webkitURL !== "undefined") ? webkitURL : null

		this.loading();
		this.$editor.show();

		this.uploader(file, this.onUploadSuccess, this.onUploadError);
	}
});
