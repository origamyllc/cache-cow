

#Cache-cow
an orm for key value stoes

[logo]: http://msqq.com/d/file/icon/2014-08-16/1db278d780633605fb707e0ae77d93de.png "Cache-cow"


Cache cow simplifies managing key value stores abstracting away caching from the application logic
currently supported key value stores are

* **Local(lru-cache)**
* **Redis**

cachecow allows for asynchronous call to cache using promises .built over known and proven libraries
it is a battle hardened library being used at monkeypatched.

you need to set the `` process.env.CONFIG_PATH ``  variable to give the location from which the configurations will be read
otherwise cache cow will use the defaults

defaults for local(lru cache) are

``
{
    lru:{
        options : {
            max: 500,
            maxAge: 1000 * 60 * 60
        }
    }
}
``

defaults for redis  are

``
{
    redis:{
        options : {
            server: 'localhost',
            secretKey: 'SeekQret-CutDev',
            port: 6379,
            db: 1
        }
    }
}
``

we are actively adding more features to the library and will inform you of new releases
as and when they are made

