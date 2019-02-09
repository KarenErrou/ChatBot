# Create the data for the chart
H <- c(3,4,9,14,75,96,98,101,105,105,108,124,141,148,192,367,674,1657,1781,3043,23383,30000,30000,30000,30000)
M <- c("Enthusiasm","Levity","Shame","Despair","Sadness","Hate","Negative-Fear","Anxiety","Love","Calmness","Fearlessness","Daze","Dislike","Positive-Hope","Compassion","Anger","Gratitude","Humility","Liking","Affection","Surprise","Joy","Positive-Expectation","Apathy","Neutral")

# Give the chart file a name
png(file = "barchart.png")

# Plot the bar chart 
barplot(H,names.arg=M,ylab="Occurences",col="blue",
	main="Occurences of Emotions when Analysing Movie Reviews",border="black", las=2, ylim=c(0,30000))

# Save the file
dev.off()
