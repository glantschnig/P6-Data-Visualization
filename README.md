# Data Visualization: Baseball Data

--------

## Summary

I decided for the Baseball data set. This data set contains 1,157 baseball players including their handedness (right or left handed), height, weight, batting average, and home runs. In the appendix you see further analysis of the data in R. I looked at the features, the distributions and correlations to define a story-line. The three main additions/changes I have made to the data set are:

- Data cleaning - removed player with avg=0 and HR=0
- Edit player with the same name, to distinguish them I added the initial for handedness to the name
- Introduce a new feature Body Mass Index (BMI - https://en.wikipedia.org/wiki/Body_mass_index), to combine two features into one (height, weight)


Story-lines / messages from the data:

- There is a high correlation between weight and height and the performance of a baseball player. Performance as measured in Home Runs and Batting average
- In addition the handedness has an influence too
- I wanted to use an animation to explain the audience the impact of BMI and Handedness on performance metric, by showing the distribution of the players as a scatter plot
- In addition the audience can explore themselves by filtering the data (by BMI) and find the best players and their indicators (hover over the bubbles and you get the details for each player)
- I decided for the scatter plot since I was mainly interested in the distribution of the baseball players by certain metric
- For the filtering use a line chart to show the filter values and use the length of the lines to show the distribution of Home Runs by BMI

## Design


Attached my first d3.js charts to make the outlined story (see summarize) explanatory.

<b>Sketch 1:</b> Introduce a category feature to explore HR by average by BMI-Index
![alt text](img/Sketch1.jpeg)
<end>

<b>Sketch 2:</b> Look at handedness by HR and average
![alt text](img/Sketch2.jpeg)
<end>

<b>Sketch 3:</b> Explore bubble chart, the size represents the sum of HR by category BMI, average. In addition the color represents handedness
![alt text](img/Sketch3.jpeg)
<end>

<b>Sketch 4:</b> Use scatter plot to show players by BMI on a grid of HR and average, use color to show handedness
![alt text](img/Sketch4.jpeg)
<end>

Sketch 4 was the winner and will be used to further enhance the story.

Design choices:

- log 2 scale for HR and added scale numbers to legend since this is not supported in D3.js - the log2 scale allows to explore the data much better since most players are in the lower end of the scale, but we do have big numbers too. On a linear scale most of the points would be around the x axis
- Change to Google colors and use opacity to show density - this makes the handedness in the scatter plot more obvious
- remove grid lines and reduce to minimum, the grid lines took away the attention from the plot, therefore I reduced them just to horizontal dotted lines to support the log 2 scale
- add animation and additional chart to show HR distribution by BMI support explanatory
- change text for axis and legend - numbers are important, but should not take too much attention from the animation
- add filter options to provide exploratory capabilities
- change bubble size, since I introduced the filter option, the total amount of bubbles displayed was reduced, hence I could play around with the size of the bubbles to make the distribution more compelling
- Introduced the filter buttons as additional line chart. This shows additional insights on the distribution of the Home Runs by BMIs


See different version as to see the involvement of the explanatory story:

- Version 1: v1_Baseball_MultipleCharts.html 
- Version 2: v2_Baseball_FinalChart.html
- Version 3: v3_Baseball_Animation.html 
- Version 4: v4_Baseball_Animation.html
- **Final version:** index.html


## Feedback

Interviewer 1

- like the scatter plot and color separation for handedness
- would introduce opacity to see density areas better
- BMI Index is a smart idea, and shows the BMI of 24-26 has the most Home Runs
- high average seems to lead to high Home Run score

Interviewer 2

- colors difficult green and blue - choose different color scheme
- add how many right, left, both by BMI Index
- Would like to see the Top 10 Players
- grid lines are taking away attention, less is more
- like the animation, gives a good first impression on the data set and the filter option let's look into specifics in more details 

Interviewer 3

- like that I see the animation in the beginning to get an 1st impression
- the distribution by BMI on right side is very insightful
- make the bubbles bigger, would give a better first view on the data
- right handed seems to be most common for top players
- you find in each BMI category player with high Home Runs


## Visualization

Final visualization - attached a picture of the final visualization. The graphic animates once through all BMI values and explains the changes in distribution of all baseball Players within the BMI category by HR, average and handedness.
![alt text](img/final.jpeg)
<end>
--------

Resources - list any sources you consulted to create your visualization:

- http://dimplejs.org/advanced_examples_viewer.html?id=advanced_storyboard_control
- http://dimplejs.org/
- http://d3js.org/
- https://en.wikipedia.org/wiki/Body_mass_index
- Book: "Interactive Data Visualization for the Web", O'Reilly

## Appendix

### Analyzing and understand the dataset
Using R to get insights into the Baseball data set:
![alt text](img/summary.jpeg)
<end>
![alt text](img/str.jpeg)
<end>
Initial observations:


To first explore this data visually, I used the ggpair function and applied it to the data-set. This will give me quick insights on the 5 variables. The intention here is to see a quick distribution of the values.

ggpairs summary as jpeg:
![alt text](img/Rplot.jpeg)
<end>


