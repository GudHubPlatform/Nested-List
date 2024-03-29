import $ from "jquery";
import 'jstree';
import '../scss/style.scss';

class NestedList extends HTMLElement {
  constructor() {
    super();
    this.appId;
    this.parentId;
    this.titleId;
    this.priorityId;
    this.fieldModel;
  }

  getAttributes() {
    this.appId = this.getAttribute('app-id');
    this.parentId = this.getAttribute('parent-id');
    this.titleId = this.getAttribute('title-id');
    this.priorityId = this.getAttribute('priority-id');
    this.fieldModel = this.getAttribute('field-model');
  }

  static get observedAttributes() {
    return ['app-id', 'field-model', 'title-id'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if(name == 'app-id' && newValue.indexOf('{{') == -1) {
      setTimeout(() => {
        this.getAttributes();
        if(this.appId && this.parentId && this.titleId)
          this.init();
      }, 0);
    }
  }

  async makeNestedList() {
    let scheme = {"type":"array","id":1,"childs":[{"type":"property","id":3,"field_id": this.titleId,"property_name":"text","property_type":"field_value"},{"type":"property","id":4,"property_name":"parent","property_type":"field_value","field_id": this.parentId},{"type":"array","id":2,"childs":[{"type":"property","id":6,"property_name":"item_id","property_type":"variable","variable_type":"current_item"}, {"type":"property","id":5,"property_name":"priority","property_type":"field_value","field_id": this.priorityId}],"is_static":1,"property_name":"data"},{"type":"property","id":7,"property_type":"static","property_name":"type","static_field_value":"item"}],"app_id": this.appId,"filter": this.fieldModel.filters_list,"property_name":"nested_array"}
    let response = await gudhub.jsonConstructor(scheme);
    let generatedModel = response.nested_array.map(element => {
      element.item_id = element.data[0].item_id;
      element.priority = element.data[0].priority;
      return element;
    })
    
   let model = gudhub.makeNestedList(generatedModel, 'item_id', "parent", "", "priority");

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
    const iconStorage = gudhub.ghconstructor.angularInjector.get('iconsStorage');
    this.fieldModel = this.fieldModel ? JSON.parse(this.fieldModel) : {};
    const isIcon = this.fieldModel.show_icon;
    let self = this;
    let nestedList = await this.makeNestedList();
    let list, parentNode, movedNodeParentId, movedNode, currentItem;

    if(isIcon) {
      const iconColor = self.fieldModel.icons_color ? self.fieldModel.icons_color.slice(1, self.fieldModel.icons_color.length): 'fff';
      this.folderIcon = await iconStorage.getCanvasIcon(self.fieldModel.folder_icon, iconColor, '12px', 'canvas');
      this.itemIcon = await iconStorage.getCanvasIcon(self.fieldModel.item_icon, iconColor, '12px', 'canvas');
    }
    
      $(self).jstree({
        core : { "check_callback" : function (operation, node, parent, position, more) {
          parentNode = parent;
          movedNodeParentId = node.parent;
          movedNode = node

          let currentTarget = $(self).jstree(true).get_node(more.ref, true);
          $(currentTarget).removeClass('droped-zone');
          if(position) $(currentTarget).addClass('droped-zone');

          //we need return true if we want to allow move
          return true;
        },
          data : nestedList
        },
        
        "plugins" : ["dnd", "types", "wholerow", "state"]
      });


      let itemUpdateCallback = async function() {
        let tree = $(self).jstree(true);
        let newData = await self.makeNestedList();
        tree.settings.core.data = newData;
        tree.refresh();
      }

      //event on item update and add for update tree
      let address = {
        app_id: self.appId
      }

      gudhub.on('gh_items_update', address, itemUpdateCallback);
      gudhub.on(
        'gh_items_add',
        address,
        async function () {
          $(self).on('model.jstree', function (event, data) {
            $(self).on('refresh.jstree', function () {
              let tree = $(self).jstree(true);
              tree.deselect_all();
              tree.select_node(data.nodes[data.nodes.length - 1]);
            })
          })
        })

        $(self).on('close_node.jstree', function (event, data) {
            data.instance.set_type(data.node, 'folder');
        });

        $(self).on('ready.jstree', function (event, data) {
          let instance = $(self).jstree(true);

          if(!instance.get_selected().length) {
            instance.select_node('j1_1')
          }
          
          instance.open_node('j1_1');
          let list = instance.get_json('#', {flat:false});
          if(isIcon) {
            setIconForElements(list, instance);
          } else {
            instance.hide_icons();
          }
        });

        $(self).on("select_node.jstree", function (e, selected) {
          
          if (self.fieldModel.send_message.app_id && self.fieldModel.send_message.field_id) {
            let [,itemId] = selected.node.data[0].item_id.split('.');
            currentItem = itemId
            let address = {
              app_id: self.fieldModel.send_message.app_id,
              field_id: self.fieldModel.send_message.field_id,
            }
            gudhub.emit('send_message', address, {value: currentItem});
          }
        })

        $(self).on("move_node.jstree", function (node, parent) {
          let tree = $(self).jstree(true);
          list = tree.get_json('#', {flat:false})

          if(isIcon) {
            setIconForElements(list, tree);
          }

          //update items when moving for saving tree
          let itemsToUpdate = [];
          if(parent.parent !== parent.old_parent) {
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
          } else {
            function sortArrayByIndex(tree) {
              tree.forEach((element, index) => {
                let [,itemId] = element.data[0].item_id.split('.');
                element.data[0].priority = index;
                itemsToUpdate.push({item_id: itemId, "fields": [{
                  "field_id": self.priorityId,
                  "field_value": index,
                }]})

                if(element.children) {
                  sortArrayByIndex(element.children)
                }
              });
              
            }
            sortArrayByIndex(list);
          }
          gudhub.updateItems(self.appId, itemsToUpdate);
        });

        function setIconForElements(elements, tree) {
          let isParentHasChildren;
          for(let i = 0; i < elements.length; i++) {
            isParentHasChildren = elements[i].children.length > 0;
            if(isParentHasChildren) {
              setIconForElements(elements[i].children, tree);
              tree.set_icon(elements[i], self.folderIcon.toDataURL());
            } else {
              tree.set_icon(elements[i], self.itemIcon.toDataURL());
            }
          }
        }
    
  }

  disconnectedCallback() {
    //remove send_message event when component is removed
    let address = {
      app_id: this.fieldModel.send_message.app_id,
      field_id: this.fieldModel.send_message.field_id,
    }

    gudhub.destroy('send_message', address);
  }
}

if(!window.customElements.get('nested-list')) {
  window.customElements.define('nested-list', NestedList);
}