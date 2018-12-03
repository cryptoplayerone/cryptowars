<template>
    <swiper ref="mySwiper" :options="swiperOptions">
        <swiper-slide class="swiper-margin no-swipe">
            <v-container fill-height>
                <v-layout>
                    <StartPage v-on:go="nextSlide()"/>
                </v-layout>
            </v-container>
        </swiper-slide>
        <swiper-slide class="swiper-margin no-swipe">
            <v-layout text-xs-center wrap>
                <v-flex xs12>
                    <GameOpen
                        v-on:player-chosen="setPlayer"
                        v-on:move-chosen="setMove"
                        v-on:play="userPlay"
                    />
                </v-flex>
            </v-layout>
        </swiper-slide>
        <swiper-slide class="swiper-margin no-swipe">
            <GameClosed
                v-if="game"
                :timer="timer"
                :player="player"
                :move="move"
                :opponentMove="opponentMove"
            />
        </swiper-slide>

        <!-- <v-btn absolute small top left fab
            color="white"
            slot="button-prev"
            class="nav prev"
        >
            <v-icon>fa-chevron-left</v-icon>
        </v-btn>
        <v-btn absolute small top right fab
            color="white"
            class="nav next"
            slot="button-next"
        >
            <v-icon>fa-chevron-right</v-icon>
        </v-btn> -->
  </div>

    </swiper>
</template>

<script>
import Vue from 'vue';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';

import StartPage from './StartPage';
import GameOpen from './GameOpen';
import GameClosed from './GameClosed';
import GameEnd from './GameEnd';
import { MovesToIndex, GameGuardian, GameState, GameStateIndex } from '../constants';
import { UserRaidenApi, GuardianApi } from '../utils';

Vue.use(VueAwesomeSwiper);

const web3Utils = require('web3-utils');

const guardianIp = 'http://192.168.0.4:3000';
const network = 3;
let invoiceNumber = 1;


export default {
    props: ['userInfo'],
    components: {
        StartPage,
        GameOpen,
        GameClosed,
        GameEnd,
    },
    data() {
        return {
            swiperOptions: {
                noSwiping: true,
                navigation: {
                    nextEl: '.next',
                    prevEl: '.prev',
                },
                noSwipingClass: "no-swipe",
                loop: false,
                slidesPerView: "auto",
            },
            userRaidenApi: null,
            guardianApi: new GuardianApi(
                Vue.axios,
                guardianIp,
            ),
            player: 1,
            game: null,
            gameState: GameState.null,
            move: MovesToIndex.rock,
            opponentMove: null,
            timer: {interval: 1200, value: 0},
            raiden_payment: null,

        }
    },
    computed: {
        swiper() {
            return this.$refs.mySwiper.swiper
        },
    },
    watch: {
        userInfo() {
            this.setUserRaidenApi();
        },
    },
    mounted() {
        this.setUserRaidenApi();
    },
    methods: {
        setUserRaidenApi() {
            this.userRaidenApi = new UserRaidenApi(
                Vue.axios,
                this.userInfo.ip,
                GameGuardian.token_address[network],
                GameGuardian.raiden_address[network]
            );
        },
        nextSlide() {
            if (this.swiper.realIndex == 0) {
                console.log('this.userInfo', this.userInfo);
                if (!this.userInfo.address || !this.userInfo.ip) {
                    this.$emit('needs-info');
                    return;
                }
                this.setCurrentGame().then(() => {
                    if (this.gameState == GameState.resolved) {
                        console.log('gameState resolved, starting new game');
                        return this.startGame();
                    }
                    return;
                }).then(() => {
                    return this.setCurrentGame();
                }).then(() => {
                    if (this.gameState == GameState.closed) {
                        alert(`wait for results on previous game: ${this.wait} sec`);
                    } else {
                        this.swiper.slideNext(1000, false);
                    }
                });
            } else {
                this.swiper.slideNext(1000, false);
            }
        },
        userPlay() {
            let self = this;
            if (!this.player || !this.move) {
                alert('Choose a player and a move.');
            }

            async function play() {
                if (!self.paymentIdentifier) {
                    await self.initMove();
                }
                if (!self.paymentIdentifier) {
                    throw new Error('Payment identifier not received.')
                }
                self.userRaidenApi.pay({
                    amount: GameGuardian.amount,
                    identifier: self.paymentIdentifier,
                }).then((response) => {
                    console.log('raiden payment response', response);
                    self.paymentIdentifier = null;
                    self.raiden_payment = response.data;
                    self.nextSlide();
                }).catch((error) => {
                    alert(`${error} on ${self.userRaidenApi.ip}`);
                });
            };
            play();
        },
        initMove() {
            return this.guardianApi.initMove(this.game._id, {
                playerId: String(this.player),
                userAddress: this.userInfo.address,
                moveHash: this.getMoveHash(),
            }).catch((error) => {
                alert(`${error} on ${this.guardianApi.ip}`);
            }).then((response) => {
                this.paymentIdentifier = response.data.paymentIdentifier;
            });
        },
        setPlayer(index) {
            this.player = index;
            console.log('this.player', this.player);
        },
        setMove(index) {
            this.move = index;
            console.log('this.move', this.move);
        },
        getSecret() {
            return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        },
        getMoveHash() {
            const secret = this.getSecret();
            console.log('secret', secret);
            if (!this.player) throw new Error('Cannot send move. No player was chosen.');
            if (!this.move) throw new Error('Cannot send move. No move was chosen.');
            if (!this.game._id) throw new Error('Cannot send move. No game._id.');
            if (!secret) throw new Error('Cannot send move. No secret was chosen.');

            return web3Utils.soliditySha3(this.player, this.move, this.game._id, secret);
        },
        setCurrentGame() {
            return this.guardianApi.getGame().then((response) => {
                let deltaTime;
                const game = response.data[0];
                this.game = game;

                deltaTime = new Date().getTime() - new Date(game.startTime).getTime();
                this.timer.interval = game.gameTime + game.resolveTime;
                this.timer.value = deltaTime;

                console.log('setCurrentGame', game);
                console.log('this.timer', this.timer);

                if (deltaTime < game.gameTime) {
                    // We are during game time, users can make moves
                    this.gameState = GameState.open;
                } else if (deltaTime < (game.gameTime + game.resolveTime)) {
                    // We are during the game resolution time, users wait for results and payments
                    this.gameState = GameState.closed;
                    this.wait = this.timer.interval - this.timer.value;
                    console.log('wait', this.wait);
                } else {
                    // Game and resolution has ended.
                    // We query for a new game
                    // setTimeout(this.setCurrentGame, 2000);
                    this.gameState = GameState.resolved;
                }
                console.log('gameState', GameStateIndex[this.gameState]);
            });
        },
        startGame() {
            return this.guardianApi.startGame();
        }
    }
}
</script>

<style>
html, body {
    margin: 0;
}
.margin {
    margin: auto;
    padding-bottom: 10px;
}
.menu{
    position:fixed!important;
    top:3px!important;
}
.menu.help {
    right: 3px!important;
}

.swiper-margin {
    margin: 0;
}
.swiper-container {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: sans-serif;
}
.swiper-slide {
    width: 100%!important;
}
/* .swiper-slide:nth-child(2n), .swiper-slide:nth-child(4n) {
    width: 70%!important;
}
.swiper-slide:nth-child(3n), .swiper-slide:nth-child(5n) {
    width: 30%!important;
    overflow-y: scroll;
} */
.fullheight, .v-window, .v-window__container {
    height: 100%;
}
.v-tabs__items {
    height: 100%;
}

.nav{
    position:fixed!important;
    top:3px!important;
}
.nav.prev {
    left: 163px!important;
}
.nav.next {
    right: 163px!important;
}
</style>
