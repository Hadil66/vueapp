<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="4">
                        <v-card class="features">
                <v-carousel hide-delimiters>
                    <v-carousel-item v-for="(ruimte, index) in ruimtes" :key="index">
                        <div class="container">
                            <v-card-title>{{ ruimte }}</v-card-title>
                            <v-card-subtitle>Max aantal personen</v-card-subtitle>  
                            <v-img
                                alt="placeholder"
                                class="placeholder-image"
                            >
                            </v-img>
                            <v-card-text> Meer ruimte informatie </v-card-text>
                        </div>
                    </v-carousel-item>
                </v-carousel>
                            <p tabindex="0"> feature 1 </p>
                            <p tabindex="0"> feature 2 </p>
                            <p tabindex="0"> feature 3 </p>
                            <p tabindex="0"> feature 4 </p>
                        </v-card>

            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        data() {
            return {
                ruimtes: [
                    'Ruimte 1',
                    'Ruimte 2',
                    'Ruimte 3',
                    'Ruimte 4',
                    'Ruimte 5',
                    'Ruimte 6',
                    'Ruimte 7'
                ],
            };
        },  
    };
</script>

<style>
    .v-window {
        height: auto !important;
        margin: 10px;
    }

    .v-window__container {
        align-items: center;
    }

    .v-window__controls {
        position: relative !important;
        max-width: 20em !important;
    }

    .v-btn {
        margin: 5px;
    }

    .v-card {
        margin: 0 !important;
        max-width: none !important;
    }
    
    .features { 
        border-radius: 8px !important;
        width: 80% !important;
        margin: 0 auto !important;
        padding: 16px  !important;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center; 
    }
    .placeholder-image { 
        border-radius: 8px !important;
        background-image: url('@/assets/placeholder.png');
        background-size: cover;
        background-position: center;
        height: 9em;
        width: 8em;
        border: solid 1px #ff7c00; 
    }

    .v-card-text {
        padding: 16px 0 !important;
    }

    p {
        text-align: center;
        border-radius: 8px !important;
        padding: 5px;
        height: 6em;
        border: 1px solid #ff7c00;
        transition: 0.3s;
    }

    @media (max-width: 849px) {
        p {
            margin: 16px;
        }
    }


    p:hover {
        -webkit-box-shadow: 2px 2px 16px 0px rgba(148,148,148,0.7);
        cursor: pointer
    }

    @media (min-width: 850px) {
        .features {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            grid-template-rows: repeat(2, 1fr) !important;
            grid-column-gap: 10px !important;
            grid-row-gap: 0px !important;
        }

        .v-carousel { grid-area: 1 / 1 / 3 / 2 !important; }
        p:nth-of-type(1) { grid-area: 1 / 2 / 2 / 3 !important; margin-top: 1rem !important; }
        p:nth-of-type(2) { grid-area: 1 / 3 / 2 / 4 !important; margin-top: 1rem !important; }
        p:nth-of-type(3) { grid-area: 2 / 2 / 3 / 3 !important; }
        p:nth-of-type(4) { grid-area: 2 / 3 / 3 / 4 !important; }
    }

    @media (min-width: 960px) {
        .v-col-md-4 {
            flex: none !important;
            max-width: none !important;
        }
    }
</style>
