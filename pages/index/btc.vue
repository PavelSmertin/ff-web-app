<template>
  <div>301</div>
</template>


<script>

	export default {
	  async asyncData ({ redirect }) {
	    redirect(301, { path: `/` });
	    return;
	  }
	}

</script>