const Reset = "\x1b[0m"

const FgRed = "\x1b[31m"
const FgGreen = "\x1b[32m"
const FgYellow = "\x1b[33m"
const FgBlue = "\x1b[34m"
const FgMagenta = "\x1b[35m"


export function magentify(str){
	return FgMagenta + str + Reset;
}

export function yellowify(str){
	return FgYellow + str + Reset;
}

export function greenify(str){
	return FgGreen + str + Reset;
}

export function blueify(str){
	return FgBlue + str + Reset;
}

export function redify(str){
	return FgRed + str + Reset;
}
