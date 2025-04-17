<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="4">
            <v-card class="features">
                <v-card-item>
                <v-card-title>Ruimte 1</v-card-title>

                <v-card-subtitle>Max aantal personen</v-card-subtitle>
                </v-card-item>

                <v-img class="placeholder-image"> </v-img>

                <v-card-text>
                    Meer ruimte informatie
                </v-card-text>
                <p> feature 1 </p>
                <p> feature 2 </p>
                <p> feature 3 </p>
                <p> feature 4 </p>

            </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>



<style>
    .features {
        width: 80% !important;
        margin: 0 auto;
    }

    .placeholder-image {
        background-image: url('@/assets/drk-plc-hldr.png');
        background-size: cover;
        background-position: center;
        height: 8em;
        width: 5em;
        border: solid 3px pink; 
        margin: 0 16px;
    }

    p {
        text-align: center;
        padding: 5px;
        border: 1px solid pink;
        margin: 8px;
        transition: 0.3s;
    }
    p:hover {
        -webkit-box-shadow: 2px 2px 16px 0px rgba(148,148,148,0.7);
        cursor: pointer
    }

    @media (min-width: 850px) {
        .features {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            grid-template-rows: 1fr 1fr 0.5fr !important;
            grid-column-gap: 10px !important;
            grid-row-gap:10px !important;
        }

        .v-card-title { grid-area: 1 / 1 / 2 / 2 !important; }
        .v-card-subtitle { grid-area: 2 / 1 / 3 / 2 !important; }
        .placeholder-image { grid-area: 2 / 1 / 3 / 2 !important; }
        .v-card-text { grid-area: 3 / 1 / 4 / 2 !important; }
        .p:nth-of-type(1) { grid-area: 1 / 2 / 3 / 3 !important; }
        .p:nth-of-type(2) { grid-area: 1 / 3 / 3 / 4 !important; }
        .p:nth-of-type(3) { grid-area: 3 / 2 / 5 / 3 !important; }
        .p:nth-of-type(4) { grid-area: 3 / 3 / 5 / 4 !important; }
            
    }
</style>
