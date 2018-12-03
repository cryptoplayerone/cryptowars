<template>
    <v-dialog ref="myDialog"
        v-model="dialog"
        width="500"
        persistent
    >
        <v-btn absolute small top right fab
            color="white"
            class="menu help"
            slot="activator"
        >
            <v-icon>fa-question</v-icon>
        </v-btn>

        <v-card>
            <v-card-title
                class="headline grey lighten-2"
                primary-title
            >
                Rock-Paper-Scissors on Raiden Network
            </v-card-title>

            <v-card-text>
                <p>To play the game, you need to run a Raiden node on Ropsten. Check out <a href="https://raiden-network.readthedocs.io/en/stable/" target="_blank">https://raiden-network.readthedocs.io/en/stable/</a> for details.</p>

                <p>Make sure you set the "--rpccorsdomain" and "--api-address" flags correctly. Make sure your Raiden node API RPC server address is public (recommended: run it on a cloud server, do not make all the ports public).</p>
                <p>Example:</p>
                <v-textarea
                    solo
                    name="input-7-1"
                    value='raiden --network-id ropsten --accept-disclaimer --eth-rpc-endpoint "https://ropsten.infura.io/v3/<YOUR_TOKEN>" --log-config "raiden:debug" --keystore-path ~/Library/Ethereum/testnet/keystore --rpccorsdomain http://192.168.0.4:8080,http://localhost:*/* --api-address http://192.168.0.4:5001'
                ></v-textarea>

                <p class="subheading">Settings</p>
                <p>To play the game, you need to provide your Raiden node info.</p>
                <v-form v-model="valid">
                    <v-text-field
                      v-model="address"
                      :rules="addressRules"
                      :counter="42"
                      label="Raiden node Ethereum address"
                      placeholder="0x0000000000000000000000000000000000000000"
                      :value="userInfo.address"
                      v-on:change="updateInfo()"
                      :append-icon="address ? `check` : ``"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="ip"
                      :rules="ipRules"
                      label="Raiden public API RPC server"
                      placeholder="192.168.0.4:5001"
                      :value="userInfo.ip"
                      v-on:change="updateInfo()"
                      :append-icon="ip ? `check` : ``"
                      required
                    ></v-text-field>
                </v-form>
                </br>
                <p class="subheading">Disclaimer</p>
                <p>This is experimental software, use it at your own risk. Only available on Ropsten.</p>
                <p>This project is built on top of Raiden Network, but it is an effort external to the Raiden Network project and not affiliated with it.</p>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    flat
                    @click="closeDialog()"
                >
                    I accept
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['infoRequired', 'userInfo'],
    data() {
        return {
            dialog: false,
            valid: false,
            address: '',
            addressRules: [
                v => !!v || 'Address is required',
                v => v.length === 42 || 'Address must be 42 characters'
            ],
            ip: '',
            ipRules: [
                v => !!v || 'IP is required',
                v => /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+$/.test(v) || 'IP must be valid'
            ]
        }
    },
    watch: {
        infoRequired() {
            if (this.infoRequired) {
                this.dialog = true;
            }
        },
    },
    methods: {
        closeDialog() {
            if(this.address && this.ip) {
                this.dialog = false;
            }
        },
        updateInfo() {
            if(this.address && this.ip) {
                this.$emit('set-info', {
                    address: this.address,
                    ip: `http://${this.ip}`,
                });
            }
        }
    }
}
</script>
