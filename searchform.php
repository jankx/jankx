<form action="<?php echo site_url(); ?>" class="form-inline my-2 my-lg-0">
	<div class="from-wrap">
		<input type="hidden" name="post_type" value="product" />
		<input type="text" name="s" value="<?php echo get_search_query(); ?>" />
		<button>Tìm kiếm</button>
	</div>
</form>