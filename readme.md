# ByunX
[![NPM](https://nodei.co/npm/byunx.png?compact=true)](https://nodei.co/npm/byunx/)

state management + event emitter + reactive stream

## Usage
```sh
npm i byunx
```
```js
//es6
import {createStore} from "byunx";

//commonjs
var createStore = require('byunx').createStore;
```

## Examples

### Basic
```js
const store = createStore({
    data:{ a: 1, b: 2 },
    computed:{
        sum(){ return this.a + this.b; }
    },
    actions:{
        update(a,b){ this.a = a; this.b = b; }
    }
});

store.get('a');
// 1
store.get('sum');
// 3

store.on(event=>{
   console.log("event trigger,", event.data); 
});

store.dispatch("update", 3, 4);
// event trigger,
// {a:3, b:4, sum:7}
```

### Stream
```js
const store = createStore({
    data:{ a: 1, b: 2 },
    computed:{
        sum(){ return this.a + this.b; }
    },
    actions:{
        update(a,b){ this.a = a; this.b = b; }
    }
});

store.stream()
    .pluck("sum")
    .take(3)
    .subscribe(sum=>{
        console.log(`sum : ${sum}`);
    });
//sum: 3

store.dispatch("update", 3, 4);
//sum: 7
store.dispatch("update", 5, 6);
//sum: 11

store.dispatch("update", 1, 2);
store.dispatch("update", 3, 2);
store.dispatch("update", 6, 2);
//nothing...
```

## API
### Store
- [get](#store-get)
- [on](#store-on)
- [off](#store-off)
- [dispatch](#store-dispatch)
- [dispatchQ](#store-dispatchQ)
- [stream](#store-stream)

### Stream
- [buffer](#stream-buffer)
- [debounce](#stream-debounce)
- [delay](#stream-delay)
- [distinct](#stream-distinct)
- [distinctUntilChanged](#stream-distinctUntilChanged)
- [filter](#stream-filter)
- [flatMap](#stream-flatMap)
- [last](#stream-last)
- [map](#stream-map)
- [merge](#stream-merge)
- [pluck](#stream-pluck)
- [publish](#stream-publish)
- [reduce](#stream-reduce)
- [scan](#stream-scan)
- [skip](#stream-skip)
- [subscribe](#stream-subscribe)
- [take](#stream-take)
- [throttle](#stream-throttle)
- [zip](#stream-zip)

---

### Store

#### <a id="store-get"></a> 
#### `get(key?: string, defaultValue = null)`

```js
store.get('a');
store.get('a.b'); // get nested property value
```

#### <a id="store-on"></a> 
#### `on(name: string, handler: function)`

```js
store.on("update:before", event=>{
    console.log("update:before", event.data);
});

store.on("update", event=>{
    console.log("updated", event);
});

store.dispatch("update", 3, 4);
// update:before {a:1, b:2, sum:3}
// updated {
//     store: store,
//     name: "update",
//     args: [3,4],
//     data:{a:3, b:4, sum:7}
// }
```
**global events** : `*`, `*:before`

#### `on(handler: function)`
alias `on("*", listener: function)`

#### <a id="store-off"></a> 
#### `off(name: string, listener?: function)`
#### `off(listener: function)`
clear registered event listeners

#### <a id="store-dispatch"></a> 
#### `dispatch(name: string, ...args)`
execute action.

#### <a id="store-dispatchQ"></a>
#### `dispatchQ(name: string, ...args)`
add action to the queue.

```js
store.on("update", event=>console.log("update: ", event.data));
store.on(event=>console.log("*: ", event.data));

store.dispatchQ("update", 1, 3);
store.dispatchQ("update", 2, 4);

console.log("end:", store.get());
// end: {a:1, b:2, sum:3} 
// update: {a:1, b:3, sum:4}
// update: {a:2, b:4, sum:6} 
// *: {a:2, b:4, sum:6}
```


#### <a id="store-stream"></a>
#### `stream()`
return stream

### Stream

#### <a id="stream-buffer"></a>
#### `buffer(size: number)`
```
1--3---4------5---3----2------
           buffer(3)
-------[1,3,4]---------[5,3,2]
```
```js
store.stream()
    .buffer(2)
    .subscribe(v=>console.log(v));

store.dispatch("update", 2, 3);
//[ {a:1,b:2,sum:3}, {a:2,b:3,sum:5} ]
```

#### <a id="stream-debounce"></a>
#### `debounce(milliseconds: number = 100, immediate?: boolean)`
```
-1-------2--3--4--5------6----
        debounce(300)
----1-----------------5------6
```

#### <a id="stream-delay"></a>
#### `delay(milliseconds: number)`
```
-1-------2--3--4--5------6----
        delay(300)
----1-------2--3--4--5------6-
```

#### <a id="stream-distinct"></a>
#### `distinct()`
```
-1-------2--1--1--2------3-
        distinct()
-1-------2---------------3-
```

#### <a id="stream-distinctUntilChanged"></a>
#### `distinctUntilChanged()`
```
-1-------2--1--1--2------3--
   distinctUntilChanged()
-1-------2--1-----2------3--
```

#### <a id="stream-filter"></a>
#### `filter(handler: function)`
```
-1-------2--1--1--2------3---
   filter((v,i)=>i%2===0)
-1----------1-----2----------
```

#### <a id="stream-flatMap"></a>
#### `flatMap(handler: function)`
```
-1----2---3-------4-------
   flatMap((v,i)=>[v,i])
-10---21--32------43------
```

#### <a id="stream-last"></a>
#### `last()`
```
--1----2---3-------4|
       last()
-------------------4|
```

#### <a id="stream-map"></a>
#### `map(handler: function)`
```
-1----2---3-------4--
     map(v=>v*2)
-2----4---6-------8--
```

#### <a id="stream-merge"></a>
#### `merge(stream)`
```
-1----2---3-------4--
---a--------b-c-----d
    merge(stream)
-1-a--2---3-b-c---4-d
```
```js
store1.stream()
    .distinct()
    .merge(store2.stream().take(5))
    .subscribe(v=>console.log(v));
```

#### <a id="stream-pluck"></a>
#### `pluck(key: string)`
```js
store.stream()
    .pluck('sum')
    .subscribe(v=>console.log("sum:", v));
// sum: 4

store.update("update", 2, 3);
// sum: 5
```

#### <a id="stream-publish"></a>
#### `publish()`
```js
const stream = store.stream()
    .pluck('sum')
    .subscribe(v=>console.log("sum:", v));
//sum: 4

stream.publish();
//sum: 4
stream.publish();
//sum: 4
```
publish to child stream

#### <a id="stream-reduce"></a>
#### `reduce()`
```
-----1----2------3-------4|
reduce((prev,v)=>prev+v, 0)
-------------------------10|
```

#### <a id="stream-scan"></a>
#### `scan(handler: function, initValue = null)`
```
-----1----2------3-------4|
scan((prev,v)=>prev+v, 0)
-----1----3------6-------10|
```

#### <a id="stream-skip"></a>
#### `skip(amount: number)`
```
--1----2---3----4-----5--
        skip(3)
----------------4-----5--
```

#### <a id="stream-subscribe"></a>
#### `subscribe(handler: function, immediately?: boolean=true)`
subscribe stream. If immediately option is false, it will be subscribed after dispatch or publish.
```js
const stream = store.stream()
    .subscribe(v=>console.log("sum:", v), false);
//nothing

stream.publish();
// sum 3
```


#### <a id="stream-take"></a>
#### `take(limit: number)`
```
--1----2---3----4-----5--
        take(3)
--1----2---3|
```

#### <a id="stream-throttle"></a>
#### `throttle(milliseconds: number = 100)`
```
-1------2-3-4-5-6-----
     throttle(300)
-1------2---4---6-----
```

#### <a id="stream-zip"></a>
#### `zip(...streams)`
```
---1--------2---3---------
----a-------------bc------
---xyz--------------------
   zip(stream1, stream2)
---[1,a,x]------[2,b,y][3,c,z]-
```
```js
store1.stream()
    .zip(store2.stream(), store2.stream().take(5))
    .subscribe(v=>console.log(v));
```

## License
MIT