<template>
    <div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-4 sidebar">
                    <sidebar></sidebar>
                </div>
                <div class="col-md-8 content" style="position:relative;">
                    <chat></chat>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import sidebar from '../components/sidebar'
    import chat from '../components/chat'

    export default {
        name: 'principal',
        components: {
            sidebar,
            chat
        }
    }
</script>

<style scoped>
    .sidebar {
        overflow: scroll;
        height: 100vh;
        background: rgb(63, 63, 63);
    }
</style>
