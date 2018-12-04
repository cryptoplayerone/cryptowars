<template>
    <v-container fill-height>
        <v-layout text-xs-center wrap>
            <v-flex xs12 v-if="winningMove">
                <v-btn
                    large fab
                >
                    <v-icon x-large>{{ `fa-hand-${winningMove}` }}</v-icon>
                </v-btn>
                <p class="display-2">{{ `You ${MovesToIndex[winningMove] == move ? `won! You should receive ${game.amount} tokens`: 'lost..'}`}}</p>
            </v-flex>
            <v-flex xs12>
                <div class="subheading">Your choices: </div>
            </v-flex>
            <GameClosedChoices :player="player" :move="move"/>

            <v-flex xs12>
                <div class="subheading">Opponent's choices: </div>
            </v-flex>
            <GameClosedChoices
                :player="opponent()"
                :move="opponentMove"
                :timer="timer"
                v-on:timer-end="$emit('timer-end')"
            />

            <v-flex xs12 v-if="winningMove">
                <v-btn
                    large round
                    v-on:click="$emit('restart-game')"
                >Play again!</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { IndexToPlayer, MovesToIndex } from '../constants';
import GameClosedChoices from './GameClosedChoices';
import Timer from './Timer';

export default {
    components: {
        GameClosedChoices,
        Timer,
    },
    props: ['game', 'timer', 'player', 'move'],
    data: () => ({
        IndexToPlayer,
        MovesToIndex,
        winningMove: null,
        opponentMove: null,
    }),
    watch: {
        game() {
            let opponentMove = this.game[`move${this.opponent()}`];
            if (opponentMove) this.opponentMove = MovesToIndex[opponentMove];
            if (this.game.winningMove) this.winningMove = this.game.winningMove;
        }
    },
    methods: {
        opponent() {
            return this.player ? (3 - this.player) : null;
        }
    }
}
</script>
