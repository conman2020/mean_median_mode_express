const express = require('express');

const app = express();


app.get('/mean', function mean(request, response, next) {
    try {
      let numbers= request.query.nums;
      const validNumbers = badApples(numbers);
      const mean = validNumbers.reduce((a,b)=>a+b,0)/validNumbers.length
      return response.send(`Mean: ${mean}`);
    } catch (e) {
      return next(e);
    }
  });

app.get('/median', function median(request, response, next) {
    try{
    let numbers= request.query.nums;
    badApples(numbers, response);
    numbers = numbers.split(',').map(Number);
    const median = findMedian(numbers);
    return response.send(`Median: ${median}`);}
    catch (e) {
        return next(e);
      }

  });

  

app.get('/mode', function mode(request, response, next) {
    try{
    let numbers= request.query.nums;
    badApples(numbers, response);
    numbers = numbers.split(',').map(Number);
    const mode = findMode(numbers);
    if (mode.length === 1) {
      response.send(`mode: ${mode[0]}`);
    } else {
      response.send(`modes: ${mode.join(', ')}`);
    }
}catch (e) {
    return next(e);
  }
  });

  app.get('/all', function all(request, response, next) {
    try{
    let numbers = request.query.nums;
    badApples(numbers, response);
    numbers = numbers.split(',').map(Number);
    const { mean, median, mode } = calculateStats(numbers);
    return response.send(`Mean: ${mean}\nMedian: ${median}\nMode: ${mode}`);}
    catch (e){
        return next(e);
    }
  });
  
  function calculateStats(numbers) {
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const median = findMedian(numbers);
    const mode = findMode(numbers);
    return { mean, median, mode };
  }




function badApples(numbers) {
    if (!numbers) {
      throw new ExpressError("nums are required", 400);
    }
    numbers = numbers.split(',').map(Number);
    if (numbers.some(n => Number.isNaN(n))) {
      throw new ExpressError(`${numbers.filter(n => Number.isNaN(n))[0]} is not a number.`, 400);
    }
    return numbers;
  }


function findMedian(numbers) {
    numbers = numbers.sort((a, b) => a - b); // Sort the array in ascending order
    const middle = Math.floor(numbers.length / 2); // Find the middle index
    if (numbers.length % 2 === 0) {
      // If the length of the array is even, return the average of the middle two elements
      return (numbers[middle - 1] + numbers[middle]) / 2;
    } else {
      // If the length of the array is odd, return the middle element
      return numbers[middle];
    }
  }



  function findMode(numbers) {
    const count = {};
    let maxCount = 0;
    let modes = [];
  
    for (let num of numbers) {
      if (!count[num]) {
        count[num] = 0;
      }
      count[num]++;
      if (count[num] > maxCount) {
        maxCount = count[num];
        modes = [num];
      } else if (count[num] === maxCount) {
        modes.push(num);
      }
    }
    if (count[num] > maxCount) {
        maxCount = count[num];
        modes = [num];
      } else if (count[num] === maxCount) {
        modes.push(num);
      }
      return modes; 
    }
  


  app.use(function errorHandler(err, req, res, next) {
    res.status(err.status || 500);
    return res.json({
      error: {
        message: err.message || "Something went wrong."
      }
    });
  });


  app.listen(3000, function(){
    console.log('App on port 3000');
  }) 