# ByunX
state management + event emitter + reactive stream

## Examples

### Basic
```ecmascript 6
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
```ecmascript 6
const store = createStore({
    data:{ a: 1, b: 3 },
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
####`get(key?: string, defaultValue = null)`

```ecmascript 6
store.get('a');
store.get('a.b'); // get nested property value
```

#### <a id="store-on"></a> 
#### `on(name: string, handler: function)`

```ecmascript 6
store.on("update:before", event=>console.log("update:before", event.data));
store.on("update", event=>console.log("update", event));
store.dispatch("update", 3, 4);
// update:before
// {a:1, b:2, sum:3}
//
// update
// {
//     store: store,
//     name: "update",
//     args: [3,4],
//     data:{a:3, b:4, sum:7}
// }
```
**Global Events** : `*`, `*:before`

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

```ecmascript 6
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

#### <a id="#stream-buffer"></a>
#### `buffer(size: number)`
```ecmascript 6

```

#### <a id="#stream-debounce"></a>
#### `debounce(milliseconds: number = 100, immediate?: boolean)`

#### <a id="#stream-delay"></a>
#### `delay(milliseconds: number)`

#### <a id="#stream-distinct"></a>
#### `distinct()`

#### <a id="#stream-distinctUntilChanged"></a>
#### `distinctUntilChanged()`

#### <a id="#stream-filter"></a>
#### `filter(handler: function)`

#### <a id="#stream-flatMap"></a>
#### `flatMap(handler: function)`

#### <a id="#stream-last"></a>
#### `last()`

#### <a id="#stream-map"></a>
#### `map(handler: function)`

#### <a id="#stream-merge"></a>
#### `merge(stream)`

#### <a id="#stream-pluck"></a>
#### `pluck(key: string)`

#### <a id="#stream-publish"></a>
#### `publish()`

#### <a id="#stream-reduce"></a>
#### `reduce()`

#### <a id="#stream-scan"></a>
#### `scan(handler: function, initValue = null)`

#### <a id="#stream-skip"></a>
#### `skip(amount: number)`

#### <a id="#stream-subscribe"></a>
#### `subscribe(handler: function, immediately?: boolean)`

#### <a id="#stream-take"></a>
#### `take(limit: number)`

#### <a id="#stream-throttle"></a>
#### `delay(throttle: number)`

#### <a id="#stream-zip"></a>
#### `zip(...streams)`