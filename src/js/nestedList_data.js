import  './nestedList.webcomponent.js';

export default class NestedListData {
   getTemplate() {

	var fieldsTemplate = {
		constructor: 'field',
		name: 'Nested List',
		icon: 'scheduling',
		type: 'nested_list',
		model: {
		field_name: "Nested List",
		data_type: "nested_list",
		data_model: {
                app_id: '',
				title_field_id: '',
				use_default_value: false,
				parent_field_id: '',
                priority_field_id: '',
				send_message: {},
                item_icon: 'element',
                folder_icon: 'folder',
                icons_color: '#18a9e8',
                filters_list: [],
				interpretation : [
					{
					src: 'form',
					id: 'default',
					settings:{
						editable: 1,
						show_field_name: 1,
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
  
      getInterpretation(gudhub, value, appId, itemId, field_model) {
        var interpretations = [{
            id: 'default',
            name: 'Default',
            content: () =>
                  `<nested-list app-id="{{field_model.data_model.app_id}}" parent-id="{{field_model.data_model.parent_field_id}}" title-id="{{field_model.data_model.title_field_id}}" priority-id="{{field_model.data_model.priority_field_id}}" field-model="{{field_model.data_model}}"></nested-list>`
          },{
            id: 'simple_icon',
            name: 'Icon',
            content: () =>
                  `<span gh-icon="scheduling #000 40px normal"></span>`
          }]; 
  
        return interpretations;
      }
  
      /*--------------------------  LOCALIZATION --------------------------------*/
      getDictionary() {
        return [
          {
            key: 'nested_list',
            en: 'Nested List',
            uk: 'Вкладений список',
            de: 'Verschachtelte Liste',
            fr: 'Liste imbriquée'
          },
          {
            key: 'default',
            en: 'Default',
            uk: 'За замовчуванням',
            de: 'Standard',
            fr: 'Par défaut'
          },
          {
            key: 'icon',
            en: 'Icon',
            uk: 'Іконка',
            de: 'Symbol',
            fr: 'Icône'
          },
          {
            key: 'options',
            en: 'Options',
            uk: 'Параметри',
            de: 'Optionen',
            fr: 'Options'
          },
          {
            key: 'items_filter',
            en: 'Items Filter',
            uk: 'Фільтр елементів',
            de: 'Elemente-Filter',
            fr: 'Filtre des éléments'
          },
          {
            key: 'show_icon',
            en: 'Show Icon',
            uk: 'Показати іконку',
            de: 'Symbol anzeigen',
            fr: "Afficher l'icône"
          },
          {
            key: 'folder_icon',
            en: 'Folder Icon',
            uk: 'Іконка папки',
            de: 'Ordner-Symbol',
            fr: 'Icône de dossier'
          },
          {
            key: 'item_icon',
            en: 'Item Icon',
            uk: 'Іконка елемента',
            de: 'Element-Symbol',
            fr: "Icône d'élément"
          },
          {
            key: 'icons_color',
            en: 'Icons Color',
            uk: 'Колір іконок',
            de: 'Symbolfarbe',
            fr: 'Couleur des icônes'
          },
          {
            key: 'app_id',
            en: 'App Id',
            uk: 'Ідентифікатор додатку',
            de: 'App-ID',
            fr: "ID de l'application"
          },
          {
            key: 'field_id',
            en: 'Parent Id',
            uk: 'Батьківський елемент',
            de: 'Übergeordnetes Element',
            fr: 'Élément parent'
          },
          {
            key: 'title_field_id',
            en: 'Title',
            uk: 'Заголовок',
            de: 'Titel',
            fr: 'Titre'
          },
          {
            key: 'sort',
            en: 'Sort By Priority',
            uk: 'Сортувати за пріоритетом',
            de: 'Nach Priorität sortieren',
            fr: 'Trier par priorité'
          },
          {
            key: 'application_to_send_message',
            en: 'Application to Send Message',
            uk: 'Додаток для надсилання повідомлення',
            de: 'Anwendung zum Senden von Nachrichten',
            fr: 'Application pour envoyer un message'
          },
          {
            key: 'field_send_message',
            en: 'Field to Send Message',
            uk: 'Поле для надсилання повідомлення',
            de: 'Feld zum Senden von Nachrichten',
            fr: 'Champ pour envoyer un message'
          }
        ];
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
                        property: 'data_model.show_icon',
                        data_model: function () {
                            return {
                                field_name: 'Show Icon',
                                name_space: 'show_icon',
                                data_type: 'boolean'
                            };
                        }
                    },
                    {
                        type: "ghElement",
                        property: "data_model.folder_icon",
                        showIf: "data_model.show_icon",
                        data_model() {
                          return {
                            field_name: "Folder Icon",
                            name_space: "folder_icon",
                            data_type: "icon",
                            data_model: {
                                interpretation: [{
                                    src: 'form',
                                    id: 'default',
                                    settings: {
                                        editable: 1,
                                        show_field_name: 1,
                                        show_field: 1,
                                        img_type: 'canvas'
                                    }
                                }],
                            }
                          };
                        },
                    },
                    {
                        type: "ghElement",
                        property: "data_model.item_icon",
                        showIf: "data_model.show_icon",
                        data_model() {
                          return {
                            field_name: "Item Icon",
                            name_space: "item_icon",
                            data_type: "icon",
                            data_model: {
                                interpretation: [{
                                    src: 'form',
                                    id: 'default',
                                    settings: {
                                        editable: 1,
                                        show_field_name: 1,
                                        show_field: 1,
                                    }
                                }]
                            }
                          };
                        },
                    },
                    {
                        type: 'ghElement',
                        property: 'data_model.icons_color',
                        showIf: "data_model.show_icon",
                        data_model: function () {
                            return {
                                field_name: 'Icons Color',
                                name_space: 'icons_color',
                                data_type: 'color'
                            };
                        }
                    }
                ], 
                [
                    {
                        title: 'Nested List',
                        type: 'header'
                    },
                    {
                        type: 'ghElement',
                        property: 'data_model.app_id',
                        data_model: function () {
                            return {
                                field_name: 'App Id',
                                name_space: 'app_id',
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
                        property: 'data_model.parent_field_id',
                        onInit: function (settingScope, fieldModel) {
    
                            settingScope.$watch(function () {
                                return fieldModel.data_model.app_id;
                            }, function(newValue) {
                                settingScope.field_model.data_model.app_id = newValue;
                            });
    
                        },
                        data_model: function (fieldModel) {
    
                            return {
                                data_model:{
                                    app_id: fieldModel.data_model.app_id
                                },
                                field_name: 'Parent Id',
                                name_space: 'field_id',
                                data_type: 'field'
                            };
                        }
                    },
                    {
                        type: 'ghElement',
                        property: 'data_model.title_field_id',
                        onInit: function (settingScope, fieldModel) {
    
                            settingScope.$watch(function () {
                                return fieldModel.data_model.app_id;
                            }, function(newValue) {
                                settingScope.field_model.data_model.app_id = newValue;
                            });
    
                        },
                        data_model: function (fieldModel) {
    
                            return {
                                data_model:{
                                    app_id: fieldModel.data_model.app_id
                                },
                                field_name: 'Title',
                                name_space: 'title_field_id',
                                data_type: 'field'
                            };
                        }
                    },
                    {
                        type: 'ghElement',
                        property: 'data_model.priority_field_id',
                        onInit: function (settingScope, fieldModel) {
    
                            settingScope.$watch(function () {
                                return fieldModel.data_model.app_id;
                            }, function(newValue) {
                                settingScope.field_model.data_model.app_id = newValue;
                            });
    
                        },
                        data_model: function (fieldModel) {
    
                            return {
                                data_model:{
                                    app_id: fieldModel.data_model.app_id
                                },
                                field_name: 'Sort By Priority',
                                name_space: 'sort',
                                data_type: 'field'
                            };
                        }
                    },
                    {
                        type: 'ghElement',
                        property: 'data_model.send_message.app_id',
                        data_model: function (fieldModel) {
                            return {
                                field_name: 'Application to Send Message',
                                name_space: 'application_to_send_message',
                                data_type: 'app',
                                data_model: {
                                    tooltip: {
                                        default: '<h3>Application to Send Message</h3>This is the aplication for choosing fields for sending the message.',
                                        en: 'EN',
                                        ua: 'UA'
                                    },
                                      
                                    current_app: false,
                                    interpretation: [{
                                        src: 'form',
                                        id: 'with_text',
                                        settings: {
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
                        property: 'data_model.send_message.field_id',
                        onInit: function (settingScope) {
                            scope.$watch(function () {
                                return scope.fieldModel.data_model.send_message.app_id;
                            }, function(newValue) {
                                settingScope.field_model.data_model.app_id = newValue;
                            });
                        },
                        data_model: function (fieldModel) {
                                return {
                                    data_model: {
                                        app_id: fieldModel.data_model.send_message.app_id,
                                        tooltip: {
                                            default: '<h3>Field to Send Message</h3>Here you should choice field that will receive the message.',
                                            en: 'EN',
                                            ua: 'UA'
                                        },
                                    },
                                    field_name: 'Field to Send Message',
                                    name_space: 'field_send_message',
                                    data_type: 'field'
                                };
                            }
                        }

                ],
                [
                    {
                        title: 'Items Filter',
                        type: 'header'
                    },
                    {
                        type: 'html',
    
                        onInit: function (settingScope) {
                            scope.$watch(function () {
                                return scope.fieldModel.data_model.app_id;
                            }, function(newValue) {
                                settingScope.field_model.recipient.app_id = newValue;
                            });
                        },
                        data_model: function (fieldModel) {
                            return {
                                recipient:{
                                    app_id: fieldModel.data_model.app_id
                                }
                            };
                        },
                        control: '<gh-filter gh-filter-data-model="field_model" filter-list="fieldModel.data_model.filters_list" gh-mode="variable"></gh-filter>'
                    }
                    
                ],
            ]
          }];
      }
}
