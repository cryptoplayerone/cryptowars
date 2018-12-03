<template>
    <v-container fill-height>
        <v-layout text-xs-center wrap>
            <v-flex xs12>
                <div class="subheading">Your choices: </div>
            </v-flex>
            <GameClosedChoices :player="player" :move="move"/>

            <v-flex xs12>
                <div class="subheading">Opponent's choices: </div>
            </v-flex>
            <GameClosedChoices :player="3 - player" :move="opponentMove" :timer="timer"/>

            <v-flex xs12>
                <div class="subheading">To play again:</div>
                <Timer
                    :time="timer.interval"
                    :startValue="timer.value"
                    size="72"
                    color="black"
                    v-on:timer-end="$emit('timer-end')"
                />
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { IndexToPlayer, IndexToMoves } from '../constants';
import GameClosedChoices from './GameClosedChoices';
import Timer from './Timer';

export default {
    components: {
        GameClosedChoices,
        Timer,
    },
    props: ['timer', 'player', 'move', 'opponentMove'],
    data: () => ({
        IndexToPlayer,
        IndexToMoves,
    }),
}
</script>
