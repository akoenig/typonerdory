/*!
 * Typonerdory
 *
 * Copyright(c) 2012 New York City, USA - All rights reserved.
 *
 * Author: André König <andre.koenig@gmail.com>
 *
 */

Typonerdory.service('gameService', [
    '$timeout',
    'nameService',

    function ($timeout, nameService) {
        'use strict';

        var data = {
            players: [],
            decks: [],
            time: 1,
            finished: false
        },
        privates = {};

        privates.tick = function () {
            $timeout(function () {
                data.time = data.time + 1;

                privates.tick();
            }, 1000);
        };

        privates.cloneDeck = function (clonable) {
            var target = {};
            
            for (var i in clonable) {
                if (clonable.hasOwnProperty(i)) {
                    target[i] = clonable[i];
                }
            }

            return target;
        };

        privates.getActivePlayer = function () {
            return _.where(data.players, {active: true})[0];
        };

        privates.setActivePlayer = function (index) {
            data.players[index].active = true;
        };

        privates.nextPlayer = function () {
            var player,
                playerCount = data.players.length,
                i = 0,
                activeIndex;

            for (i; i < playerCount; i = i + 1) {
                player = data.players[i];

                if (player.active) {
                    activeIndex = i
                }

                player.active = false;
            }

            if ((data.players[activeIndex + 1])) {
                privates.setActivePlayer(activeIndex + 1);
            } else {
                privates.setActivePlayer(0);
            }
        };

        privates.getDeck = function (id) {
            return _.where(data.decks, {id: id})[0];
        };

        privates.getDecks = function () {
            return data.decks;
        };

        privates.getFoundDecks = function () {
            return _.where(data.decks, {found: true});
        };

        privates.getSelectedDecks = function () {
            return _.where(data.decks, {selected: true});
        };

        privates.clearSelectedDecks = function () {
            var deck,
                deckCount = data.decks.length,
                i = 0;

            for (i; i < deckCount; i = i + 1) {
                deck = data.decks[i];

                deck.selected = false;
            }
        };

        // Start a new game. Inits the game data.
        this.start = function (rawDecks) {
            var clonedDeck,
                deck,
                deckCount = rawDecks.length,
                i = 0;

            // Create two players
            // The first player.
            data.players.push({
                name: nameService.generate(),
                points: 0,
                active: false
            });

            // The first player.
            data.players.push({
                name: nameService.generate(data.players[0].name), // Avoid same name
                points: 0,
                active: false
            });

            // Create the game deck.
            for (i; i < deckCount; i = i + 1) {
                deck = rawDecks[i];
                clonedDeck = privates.cloneDeck(deck);

                data.decks.push({
                    id: deck.id,
                    content: {
                        family: deck.family,
                        variant: deck.variant
                    },
                    found: false
                });

                data.decks.push({
                    id: clonedDeck.id + '-cloned',
                    content: {
                        family: clonedDeck.family,
                        variant: clonedDeck.variant
                    },
                    found: false
                });
            }

            data.decks = _.shuffle(data.decks);

            // Creating deck numbers. Now we have twice as many decks.
            deckCount = data.decks.length;
            i = 0;

            for (i; i < deckCount; i = i + 1) {
                deck = data.decks[i];

                deck.no = (i + 1);
            }

            // Determine which player is about to start.
            privates.setActivePlayer([Math.floor(Math.random()*data.players.length)]);

            // Start the game timer.
            privates.tick();

            return data;
        };

        this.selectDeck = function (id) {
            var deck = privates.getDeck(id),
                player = privates.getActivePlayer(),
                firstDeck,
                secondDeck,
                selectedDecks;

            deck.selected = true;

            selectedDecks = privates.getSelectedDecks();

            if (2 === selectedDecks.length) {
                firstDeck = selectedDecks[0];
                secondDeck = selectedDecks[1];

                if (firstDeck.content.family === secondDeck.content.family) {
                    player.points = player.points + 1;
                    firstDeck.found = secondDeck.found = true;
                } else {
                    privates.nextPlayer();
                }

                privates.clearSelectedDecks();

                if (privates.getDecks().length === privates.getFoundDecks().length) {
                    data.finished = true;
                }
            }
        };
    }
]);