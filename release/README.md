# Cerberus release processes

[Cerberus](http://www.cerberus-testing.org/) is an user-friendly automated testing framework.

This project is the entry point to release Cerberus project modules.

## Get started

This project defines a set of release processes, each of them represented by a `.cmds` file.

A `.cmds` file gathers all necessary commands to be executed in order to apply a release process. These commands can be executed thanks to the [runcmds](https://github.com/abourdon/runcmds) command execution tool.
 
Finally, each `.cmds` file contains a documentation header part to describe how to use it.

### Cerberus github release


### Step 1 : Run the script that perform the release

Go to your cerberus/release folder
`
    cd <path_to_cerberusclone>/release/
`
And run the release cmd :
`
 ./runcmds.sh
       -e RELEASE_VERSION <release version> 
       -e NEXT_DEVELOPMENT_VERSION <next development version> 
       -e DATABASE_VERSION <current database version>
       -s ./release.cmds
`

`release.cmds` will clone a cerberus on release/cerberus-testing, change some version on bin/*.sh script and make a `mvn release`.

NB : If under Windows, you can submit the command from docker bash.

### Step 2 : Copy paste changelog on github

* Click on 'Draft new release'.
* Choose xnew.ynew branch
* Put in title : cerberus-testing-xnew-ynew
* copy/paste adoc file under ressource/documentation/include/en/changelog_xdev_ydev.adoc to centent.
* Upload Cerberus-xnew.ynew.zip and Cerberus-xnew.ynew.war
* Press 'Create Release'

### Cerberus docker release

### Step 1 : Docker Login

You need to be logged in to docker registry to perform the docker's release
`
    docker login -p <password> -u <username>
`
Where:
 - <password> is your docker hub password
 - <username> is your docker hub username
 
 **/!\ you need to have the right on cerberus repository for docker hub**

### Step 2 : Run the script that perform the release

Go to your cerberus/docker folder
`
    cd <path_to_cerberusclone>/release/cerberus-source/docker/images/cerberus-as-glassfish
`
And run the release cmd :
`
 ../../../../runcmds.sh
       -e RELEASE_VERSION <release version> 
       -s ./release.cmds
`

`release.cmds` will make a `docker build`.

NB : If under Windows, you can submit the command from docker bash.


## List of available release processes

Hereafter the list of available release processes:

File                            | Description                        
--------------------------------|---------------------------------------------------------------------
[common.cmds](./common.cmds)    | Release all necessary Cerberus project modules for a common release which are [cerberus-source](https://github.com/cerberustesting/cerberus-source) and [cerberus-as-glassfish](https://github.com/cerberustesting/cerberus-source/tree/master/docker/images/cerberus-as-glassfish).
  
## License

Cerberus Copyright (C) 2013 - 2017 cerberustesting

This file is part of Cerberus.

Cerberus is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Cerberus is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Cerberus.  If not, see <http://www.gnu.org/licenses/>.
