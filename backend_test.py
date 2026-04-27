import requests
import sys
import json
from datetime import datetime

class ShintergyAPITester:
    def __init__(self, base_url="https://machinery-rent-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"Response: {json.dumps(response_data, indent=2)}")
                    return True, response_data
                except:
                    print(f"Response: {response.text}")
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test(
            "Root API Endpoint",
            "GET",
            "api/",
            200
        )

    def test_create_quote(self):
        """Test quote creation with full data"""
        quote_data = {
            "service_type": "retroexcavadora",
            "rental_duration": "week",
            "additional_services": ["gps", "seguro_extra"],
            "location": "Monterrey, NL",
            "contact_info": {
                "name": "Test User",
                "email": "cezeulor123@gmail.com",
                "phone": "+52 555 1234"
            }
        }
        
        success, response = self.run_test(
            "Create Quote",
            "POST",
            "api/quotes/create",
            200,
            data=quote_data
        )
        
        if success and response:
            self.quote_id = response.get('quote_id')
            print(f"📋 Quote ID created: {self.quote_id}")
            print(f"💰 Total Price: ${response.get('total_price', 0):,.2f}")
            print(f"📧 Email sent: {response.get('email_sent', False)}")
            return True, response
        return False, {}

    def test_get_quote(self, quote_id):
        """Test getting a specific quote"""
        if not quote_id:
            print("❌ No quote ID available for testing")
            return False, {}
            
        return self.run_test(
            f"Get Quote {quote_id}",
            "GET",
            f"api/quotes/{quote_id}",
            200
        )

    def test_list_quotes(self):
        """Test listing all quotes"""
        return self.run_test(
            "List Quotes",
            "GET",
            "api/quotes",
            200
        )

    def test_pricing_calculation(self):
        """Test different pricing scenarios"""
        test_cases = [
            {
                "name": "Volteo - Day",
                "data": {
                    "service_type": "volteo",
                    "rental_duration": "day",
                    "additional_services": [],
                    "location": "Guadalajara, JAL",
                    "contact_info": {
                        "name": "Test Volteo",
                        "email": "volteo@test.com",
                        "phone": "+52 33 1234 5678"
                    }
                },
                "expected_base": 2500
            },
            {
                "name": "Retroexcavadora - Month with GPS",
                "data": {
                    "service_type": "retroexcavadora",
                    "rental_duration": "month",
                    "additional_services": ["gps"],
                    "location": "Monterrey, NL",
                    "contact_info": {
                        "name": "Test Retro",
                        "email": "retro@test.com",
                        "phone": "+52 81 1234 5678"
                    }
                },
                "expected_base": 70000
            }
        ]
        
        for test_case in test_cases:
            print(f"\n🧮 Testing pricing for: {test_case['name']}")
            success, response = self.run_test(
                f"Pricing Test - {test_case['name']}",
                "POST",
                "api/quotes/create",
                200,
                data=test_case['data']
            )
            
            if success and response:
                total_price = response.get('total_price', 0)
                print(f"💰 Total calculated: ${total_price:,.2f}")
                # Basic validation - total should be greater than base price due to IVA
                if total_price > test_case['expected_base']:
                    print(f"✅ Pricing calculation appears correct (includes IVA)")
                else:
                    print(f"⚠️ Pricing might be incorrect - total should be > {test_case['expected_base']}")

def main():
    print("🏗️ Starting Shíntergy API Testing...")
    print("=" * 50)
    
    tester = ShintergyAPITester()
    quote_id = None

    # Test 1: Root endpoint
    tester.test_root_endpoint()

    # Test 2: Create quote (main functionality)
    success, response = tester.test_create_quote()
    if success:
        quote_id = response.get('quote_id')

    # Test 3: Get specific quote
    if quote_id:
        tester.test_get_quote(quote_id)

    # Test 4: List quotes
    tester.test_list_quotes()

    # Test 5: Pricing calculations
    tester.test_pricing_calculation()

    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️ Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())