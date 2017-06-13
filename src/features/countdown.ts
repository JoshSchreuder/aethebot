/**
 * Gives you countdown times to various events.
 */

/*
 * AetheBot - A Discord Chatbot
 * 
 * Created by Tyrone Trevorrow on 13/06/17.
 * Copyright (c) 2017 Tyrone Trevorrow. All rights reserved.
 * 
 * This source code is licensed under the permissive MIT license.
 */

import "moment-precise-range-plugin"
import {Feature} from "./feature"
import * as Discord from "discord.js"
import * as Moment from "moment"

Moment.locale("en")

interface Countdown {
    endTime: Date
    name: string
}

const countdowns = {
    stormblood: {
        endTime: new Date(2017, 5, 16, 19),
        name: "Stormblood Launch"
    }
} as {[name: string]: Countdown}

export class CountdownFeature extends Feature {
    handleMessage(message: Discord.Message): boolean {
        if (!message.isMentioned(this.bot.user)) {
            return false
        }
        const tokens = this.commandTokens(message)

        if (tokens.length < 1 ||
            tokens[0].toLowerCase() != "countdown") {
            return false
        }

        const name = tokens.splice(1).join(" ")
        if (!countdowns[name]) {
            return false
        }
        const countdown = countdowns[name]
        const date = Moment(countdown.endTime)
        const now = Moment()
        const millisUntil = date.unix() - now.unix()
        if (millisUntil > 0) {
            const intervalStr = now.preciseDiff(date)
            this.replyWith(message, `${countdown.name}: ${intervalStr}`)
        } else {
            this.replyWith(message, `${countdown.name}: already happened!`)
        }
    }
}
