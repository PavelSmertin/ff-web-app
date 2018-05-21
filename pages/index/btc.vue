<template>
  <div>301</div>
</template>


<script>

	export default {
	  data ({ redirect }) {
	    redirect(301, { path: `/` });
	    return;
	  }
	}

</script>