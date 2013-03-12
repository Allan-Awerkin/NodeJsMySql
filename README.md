#NodeJsMySql Sample Rest API (POST from SAP)

NodeJs Server with REST APIs to populate MySql Db.

This sample has been really inspired by this post : [Epita](http://www.mti.epita.fr/blogs/2012/07/24/creer-un-webservice-pour-une-base-de-donnees-mysql-avec-nodejs/).
##Goals and Intentions
The idea of this POC is to :

* Populate MySql with POST api call from SAP Backend
* Use this Db and API to build a client mobile application

##ABAP SapLink and Nuggets
```abap
    Data zcl_http_service type ref to cl_http_service.
```