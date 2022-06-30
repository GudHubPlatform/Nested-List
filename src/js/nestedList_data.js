import  './nestedList.webcomponent.js';

export default class NestedListData {
   getTemplate() {

			var fieldsTemplate = {
  			constructor: 'field',
				name: 'Nested List',
				icon: 'scheduling',
				type: 'nested_list',
				model: {
					file_name: '0',
                    field_name: "Nested List",
                    data_type: "nested_list",
					data_model: {
                        title: '',
						use_default_value: false,
						parent_id: '',
						children_property: null,
						interpretation : [
							{
								src: 'form',
								id: 'default',
								settings:{
									editable: 1,
									show_field_name: 0,
									show_field: 1
								}
							}
						]
					}
				}
			};

			return fieldsTemplate;
		}
  
      /*------------------------------- ACTION INTERPRETATION --------------------------------------*/
  
      getInterpretation(value, appId, itemId, field_model) {
        var interpretations = [{
            id: 'default',
            name: 'Default',
            content: () =>
                  `<nested-list app-id="{{field_model.data_model.application_id}}" parent-id="{{field_model.data_model.parent_id}}" title-id="{{field_model.data_model.title}}" priority-id="{{field_model.data_model.priority}}"></nested-list>`
          },{
            id: 'simple_icon',
            name: 'Icon',
            content: () =>
                  `<span gh-icon="scheduling #000 40px normal"></span>`
          }]; 
  
        return interpretations;
      }
  
      /*--------------------------  ACTION SETTINGS --------------------------------*/
      getSettings(scope) {
        return [{
            title: 'Options',
            type: 'general_setting',
            icon: 'menu',
            columns_list: [
                        [
                        {
                            type: 'ghElement',
                            property: 'data_model.application_id',
                            data_model: function () {
                                    return {
                                            field_name: 'App Id',
                                            name_space: 'application_id',
                                            data_type: 'app',
                                            data_model: {
                                                interpretation : [{
                                                    src: 'form',
                                                    id: 'with_text',
                                                    settings:{
                                                        editable: 1,
                                                        show_field_name: 1,
                                                        show_field: 1
                                                    }
                                                }]
                                            }
                                    };
                            }
                    },
                    {
                        type: 'ghElement',
                        property: 'data_model.parent_id',
                        showIf: 'data_model.application_id',
                        onInit: function (settingScope, fieldModel) {
    
                            settingScope.$watch(function () {
                                return fieldModel.data_model.application_id;
                            }, function(newValue) {
                                settingScope.field_model.data_model.app_id = newValue;
                            });
    
                        },
                        data_model: function (fieldModel) {
    
                            return {
                                data_model:{
                                    app_id: fieldModel.data_model.application_id
                                },
                                field_name: 'Parent Id',
                                name_space: 'field_id',
                                data_type: 'field'
                            };
                        }
                    },
                    {
                        type: 'ghElement',
                        property: 'data_model.title',
                        showIf: 'data_model.application_id',
                        onInit: function (settingScope, fieldModel) {
    
                            settingScope.$watch(function () {
                                return fieldModel.data_model.application_id;
                            }, function(newValue) {
                                settingScope.field_model.data_model.app_id = newValue;
                            });
    
                        },
                        data_model: function (fieldModel) {
    
                            return {
                                data_model:{
                                    app_id: fieldModel.data_model.application_id
                                },
                                field_name: 'Title',
                                name_space: 'title_id',
                                data_type: 'field'
                            };
                        }
                    },
                    {
                        type: 'ghElement',
                        property: 'data_model.priority',
                        showIf: 'data_model.application_id',
                        onInit: function (settingScope, fieldModel) {
    
                            settingScope.$watch(function () {
                                return fieldModel.data_model.application_id;
                            }, function(newValue) {
                                settingScope.field_model.data_model.app_id = newValue;
                            });
    
                        },
                        data_model: function (fieldModel) {
    
                            return {
                                data_model:{
                                    app_id: fieldModel.data_model.application_id
                                },
                                field_name: 'Sort By Priority',
                                name_space: 'sort',
                                data_type: 'field'
                            };
                        }
                    }
                    ]
                    ]
          }];
      }
}