resource "azurerm_kubernetes_cluster" "test" {
  name       = "inklin"
  location   = "eastus"
  dns_prefix = "inklin"

  resource_group_name = "inklin"

  linux_profile {
    admin_username = "juda"

    ssh_key {
      key_data = "ssh-rsa {snip} juda@msft"
    }
  }

  agent_pool_profile {
    name    = "agentpool"
    count   = "2"
    vm_size = "Standard_DS2_v2"
    os_type = "Linux"

    # Required for advanced networking
    vnet_subnet_id = "/subscriptions/{snip}/resourceGroups/fether/providers/Microsoft.Network/virtualNetworks/fether/default"
  }

  service_principal {
    client_id     = "00000000-0000-0000-0000-000000000000"
    client_secret = "00000000000000000000000000000000"
  }

  network_profile {
    network_plugin = "azure"
  }
}
