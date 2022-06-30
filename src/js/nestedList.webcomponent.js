import $ from "jquery";
import 'jstree';
import itemIcon from '../icons/file.svg';
import folderIcon from '../icons/folder.svg';
import folderOpenedIcon from '../icons/folder_opened.svg';

class NestedList extends HTMLElement {
  constructor() {
    super();
    this.appId;
    this.parentId;
    this.titleId;
    this.priorityId;
    
  }
  connectedCallback() {
    setTimeout(() => {
      this.getAttributes();
      if(this.appId && this.titleId && this.parentId) this.init();
    }, 0);
    
  }

  getAttributes() {
    this.appId = this.getAttribute('app-id');
    this.parentId = this.getAttribute('parent-id');
    this.titleId = this.getAttribute('title-id');
    this.priorityId = this.getAttribute('priority-id');
  }
  async makeNestedList() {
    let scheme = {"type":"array","id":1,"childs":[{"type":"property","id":3,"field_id": this.titleId,"property_name":"text","property_type":"field_value"},{"type":"property","id":4,"property_name":"parent","property_type":"field_value","field_id": this.parentId},{"type":"property","id":5,"property_name":"priority","property_type":"field_value","field_id": this.priorityId},{"type":"array","id":2,"childs":[{"type":"property","id":6,"property_name":"item_id","property_type":"variable","variable_type":"current_item"}],"is_static":1,"property_name":"data"},{"type":"property","id":7,"property_type":"static","property_name":"type","static_field_value":"item"}],"app_id": this.appId,"filter":[],"property_name":"nested_array"}
    let response = await gudhub.jsonConstructor(scheme);
    let generatedModel = response.nested_array.map(element => {
      element = element;
      element.item_id = element.data[0].item_id;
      return element;
    })
    
   let model = gudhub.makeNestedList(generatedModel, 'item_id', "parent");

   // set type of generated model
   function setType (model) {
    let isParentHasChildren;
    for(let i = 0; i < model.length; i++) {
      isParentHasChildren = model[i].children;
      if(isParentHasChildren) {
        model[i].type = 'folder';
        setType(model[i].children);
      } else {
        model[i].type = 'item';
      }
    }
   }
   setType(model);
  
   return model;
  }

  async init() {
    let self = this;
    let data = await this.makeNestedList();
    let list, parentNode, movedNodeParentId, movedNode;
    $(function() {
      $(self).jstree({
        core : { "check_callback" : function (op, node, parent, position, more) {
          parentNode = parent;
          movedNodeParentId = node.parent;
          movedNode = node

          //we need return true if we want to allow move
          return true;
        },
          
          data : data
        },
          "types" : {
          
          "folder" : {
            "icon" : folderIcon,
          },
          "item" : {
            "icon" : itemIcon
          },
         'opened': {
            'icon': folderOpenedIcon
         }
        },
        
        "plugins" : ["dnd", "types", "wholerow"]
      });


      let itemUpdateCallback = async function() {
        let tree = $(self).jstree(true);
        let newData = await self.makeNestedList();
        tree.settings.core.data = newData;
        tree.refresh();
      }

      let address = {
        app_id: self.appId
      }
      gudhub.on('gh_items_update', address, itemUpdateCallback);

        // change icon on opened/closed
        $(self).on('open_node.jstree', function (event, data) {
            data.instance.set_type(data.node, 'opened');
        })
        $(self).on('close_node.jstree', function (event, data) {
            data.instance.set_type(data.node, 'folder');
        });

      $(self).on("move_node.jstree", function (node, parent) {
        list = $(self).jstree(true).get_json('#', {flat:false})
        var instance = $(self).jstree(true);
        instance.set_type(parentNode, 'folder')

        //get parent if it's there are and set type item if not
        let movedNodeParent = instance.get_node(movedNodeParentId, true)
        let childrenParent = instance.get_children_dom(movedNodeParent);
        if(!Boolean(childrenParent.length)) {
          instance.set_type(movedNodeParent, 'item')
        }
        console.log(list)
        //update items when moving for saving tree
        if(parent.parent !== parent.old_parent) {
          let itemsToUpdate = [];
          let [,itemId] = movedNode.data[0].item_id.split('.');
          let fieldValue;
          if(parentNode.id == '#') {
            fieldValue = '';
          } else {
            fieldValue = parentNode.data[0].item_id;
          }
          
          const item = {
            item_id: itemId,
            fields: [{
              field_id: self.parentId,
              field_value: fieldValue,
            }]
          }

          itemsToUpdate.push(item)
          gudhub.updateItems(self.appId, itemsToUpdate);
        }
      });
    
    });
  }
}

if(!window.customElements.get('nested-list')) {
  window.customElements.define('nested-list', NestedList);
}