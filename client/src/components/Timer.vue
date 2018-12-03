<template>
    <div class="text-xs-center">
        <v-progress-circular
            :rotate="-90"
            :size="size"
            :width="15"
            :value="value || 0"
            :color="color"
        >
            {{ getTimeLeft() }}
        </v-progress-circular>
    </div>
</template>

<script>
export default {
    props: ['time', 'color','startValue', 'size'],
    data() {
        return {
            value: this.secondsToValue(this.startValue),
            interval: {},
            intervalTime: 1000,
        }
    },
    beforeDestroy () {
        clearInterval(this.interval);
    },
    mounted () {
        console.log('mounted timer')
        console.log('startValue', this.startValue, this.formatTime(this.startValue))
        this.setTimer();
    },
    // watch: {
    //     startValue() {
    //         console.log('watch timer')
    //         this.setValue();
    //         this.setTimer();
    //     },
    // },
    methods: {
        setValue() {
            this.value = this.secondsToValue(this.startValue);
        },
        secondsToValue(seconds=0) {
            return 100 * seconds / this.time;
        },
        valueToTime() {

        },
        setTimer() {
            this.increment = Math.floor(this.time / this.intervalTime / 100);
            console.log('setTimer increment', this.increment)
            console.log('this.value', this.value)
            console.log('setTimer', this.increment, this.time, this.startValue, this.formatTime(this.time - this.startValue));
            this.interval = setInterval(() => {
                if (this.value === 100) {
                    this.$emit('timer-end');
                    clearInterval(this.interval);
                    return (this.value = 0);
                }
                this.value += this.increment;
            }, this.intervalTime);
        },
        getTimeLeft: function(value) {
            value = value || this.value;
            //console.log('getTimeLeft', value);
            let seconds = Math.floor((this.time - this.time * value / 100) / 1000);
            return this.formatTime(seconds);
        },
        formatTime: (mseconds) => {
            let seconds = Math.floor(mseconds / 1000);
            let minutes = Math.floor(seconds / 60);
            return `${minutes > 0 ? minutes + ' min ' : ''}${seconds - minutes * 60} sec`;
        }
    }
}
</script>
